import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BlinkService } from '../../../service/blink.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalNovoJogoComponent } from '../../../componentes/modal-novo-jogo/modal-novo-jogo.component';
import { PlacarService } from '../../../service/placar.service';
import { Jogador } from '../../../componentes/interface/Jogador';

@Component({
  selector: 'app-memoria',
  standalone: true,
  imports: [CommonModule, ModalNovoJogoComponent],
  templateUrl: './memoria.component.html',
  styleUrls: ['./memoria.component.css'],
})

export class MemoriaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private subscription: Subscription | undefined;
  private blinkSubscription: Subscription | undefined;
  private intervalSubscription: Subscription | undefined;

  ReconhecimentoOcular = false;
  indiceSelecionado: number = 0;
  botJogou: boolean = false;
  cartas: Carta[] = [];
  showVitoria = false;
  private indiceAutoSelecionado: number = 0;
  private cartasViradas: Carta[] = [];
  private estaVerificando: boolean = false;

  gameMode: number = 2;
  gameActive = true;

  jogadores: Jogador[] = [];

  constructor(private blinkService: BlinkService, private router: Router, private route: ActivatedRoute, private placarService: PlacarService) {}

  ngOnInit() {
    this.carregarMaioresPontuacoes();

    this.route.params.subscribe((params) => {
      this.gameMode = +params['mode'];
      if (this.gameMode === 2) {
        this.ReconhecimentoOcular = true;
        this.iniciarAutoSelecao();
      }
      this.inicializarCartas(); 
    });

    this.blinkSubscription = this.blinkService.blinkDetected.subscribe(() => {
      if (this.gameMode === 2 && this.gameActive) {
        this.onBlinkDetected();
      }
    });

  }

  getImagemPorIndice(indice: number): string {
    const imagens = [
        '../../../assets/img/primeiro.png', 
        '../../../assets/img/segundo.png', 
        '../../../assets/img/terceiro.png'  
    ];

    return imagens[indice];
  }

  ngAfterViewInit(): void {
    if (this.gameMode === 2) {
      this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
        .catch((error) => console.error("Erro ao inicializar FaceMesh:", error));
    }
  }

  private carregarMaioresPontuacoes() {
    const id_jogo = 2; 
    const id_controle = this.gameMode; 

    this.placarService.MaioresPontuacoes(id_jogo, id_controle).subscribe(data => {
      console.log(data); 
      if (data && data.maioresPontuacoes) { 
          this.jogadores = data.maioresPontuacoes.map((item: any) => ({
              nome: item.Jogador, 
          }));
      } else {
          this.jogadores = []; 
      }
  
    });
  
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
    this.gameActive = false; 

    if (this.ReconhecimentoOcular) {
      this.blinkService.stopCamera(this.videoElement.nativeElement);
    }
  }

  private iniciarAutoSelecao() {
    this.intervalSubscription = interval(1500).subscribe(() => {
      if (this.gameActive) {
        do {
          this.indiceAutoSelecionado = (this.indiceAutoSelecionado + 1) % this.cartas.length;
        } while (this.cartas[this.indiceAutoSelecionado].virada);

        this.selecionarCarta(this.indiceAutoSelecionado);
      }
    });
  }

  private selecionarCarta(indice: number) {
    this.cartas.forEach((carta, i) => {
      carta.selecionada = (i === indice);
    });
  }

  virarCarta(carta: Carta | undefined) {
    if (!this.estaVerificando && carta && !carta.virada) {
      carta.virada = true;
      this.cartasViradas.push(carta);

      if (this.cartasViradas.length === 2) {
        this.estaVerificando = true;
        setTimeout(() => {
          this.verificarCombinacao();
        }, 1000);
      }
    }
  }

  inicializarCartas() {
    const imagens = [
      '../../../assets/img/memoria/banana.png',
      '../../../assets/img/memoria/laranja.png',
      '../../../assets/img/memoria/maca.png',
      '../../../assets/img/memoria/morango.png',
      '../../../assets/img/memoria/uvas.png',
    ];

    this.cartas = imagens.flatMap((imagem, index) => [
      { id: index * 2, imagem, virada: false, selecionada: false },
      { id: index * 2 + 1, imagem, virada: false, selecionada: false },
    ]);

    this.cartas = this.embaralhar(this.cartas);
  }

  embaralhar(array: Carta[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }

  private onBlinkDetected() {
    if (!this.gameActive) return; // Impede ação se o jogo não estiver ativo
    const cartaSelecionada = this.cartas.find(carta => carta.selecionada && !carta.virada); 
    if (cartaSelecionada) {
      this.virarCarta(cartaSelecionada);
    }
  }

  verificarCombinacao() {
    const [primeiraCarta, segundaCarta] = this.cartasViradas;
  
    if (primeiraCarta.imagem !== segundaCarta.imagem) {
      setTimeout(() => {
        primeiraCarta.virada = false;
        segundaCarta.virada = false;
        this.cartasViradas = [];
        this.estaVerificando = false;
      }, 1000);
    } else {
      primeiraCarta.virada = true;
      segundaCarta.virada = true;
      this.cartasViradas = [];
      this.estaVerificando = false;
  
      // Verifique se todas as cartas foram viradas
      if (this.cartas.every(carta => carta.virada)) {
        this.showVitoria = true; // Exibe a modal de vitória
        this.gameActive = false;  // Impede novas ações
        
        // Reinicia o jogo após 5 segundos
        setTimeout(() => {
          this.reiniciarJogo();
        }, 5000);

      } else {
        // Verifica se apenas uma carta não foi virada
        const cartasNaoViradas = this.cartas.filter(carta => !carta.virada);
        if (cartasNaoViradas.length === 2) {

          this.showVitoria = true; // Exibe a modal de vitória
          this.gameActive = false;  // Impede novas ações
  
          // Reinicia o jogo após 5 segundos
          setTimeout(() => {
            this.reiniciarJogo();
          }, 5000);
        }
      }
    }
  }
  
  reiniciarJogo() {
    this.inicializarCartas();
    this.gameActive = true;
    this.showVitoria = false;
  }
}

interface Carta {
  id: number;
  imagem: string;
  virada: boolean;
  selecionada: boolean;
}
