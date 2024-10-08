import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BlinkService } from '../../../service/blink.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalNovoJogoComponent } from '../../../componentes/modal-novo-jogo/modal-novo-jogo.component';

@Component({
  selector: 'app-memoria',
  standalone: true,
  imports: [CommonModule, ModalNovoJogoComponent],
  templateUrl: './memoria.component.html',
  styleUrl: './memoria.component.css'
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
  showDerrota = false;
  showEmpate = false;

  private indiceAutoSelecionado: number = 0;
  private cartasViradas: Carta[] = [];
  private estaVerificando: boolean = false;

  gameMode: number = 2;
  gameActive = true;

  constructor(private blinkService: BlinkService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameMode = +params['mode'];
      if (this.gameMode === 2) {
        this.ReconhecimentoOcular = true;
        this.iniciarAutoSelecao();
      }
      this.inicializarCartas(); // Inicializa as cartas
    });

    this.blinkSubscription = this.blinkService.blinkDetected.subscribe(() => {
      if (this.gameMode === 2 && this.gameActive) {
        this.onBlinkDetected();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.gameMode === 2) {
      this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
        .catch(error => console.error("Erro ao inicializar FaceMesh:", error));
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.blinkSubscription?.unsubscribe();
    this.intervalSubscription?.unsubscribe();

    if (this.ReconhecimentoOcular) {
      this.blinkService.stopCamera(this.videoElement.nativeElement);
    }

    this.gameActive = false;
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
      this.cartasViradas = [];
      this.estaVerificando = false;
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
      { id: index * 2 + 1, imagem, virada: false, selecionada: false }
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
    const cartaSelecionada = this.cartas.find(carta => carta.selecionada);
    this.virarCarta(cartaSelecionada);
  }
}

interface Carta {
  id: number;
  imagem: string;
  virada: boolean;
  selecionada: boolean; 
}
