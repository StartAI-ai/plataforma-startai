import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BlinkService } from '../../../service/blink.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalNovoJogoComponent } from '../../../componentes/modal-novo-jogo/modal-novo-jogo.component';
import { PlacarService } from '../../../service/placar.service';

@Component({
  selector: 'app-velha',
  standalone: true,
  imports: [CommonModule, ModalNovoJogoComponent],
  templateUrl: './velha.component.html',
  styleUrl: './velha.component.css'
})
export class VelhaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private subscription: Subscription | undefined;
  private blinkSubscription: Subscription | undefined;

  ReconhecimentoOcular = false;
  gameActive = true; 
  showVitoria = false;
  showDerrota = false;
  showEmpate = false;

  private modalTimer: any;

  selectedIndex: number = 0;
  botHasPlayed: boolean = false;
  cellValues: (string | null)[] = Array(9).fill(null);
  gameMode: number = 2;

  listaPontuacoes: { pontuacao: number; Jogador: string }[] = [];

  constructor(private blinkService: BlinkService, private router: Router, private route: ActivatedRoute, private placarService: PlacarService) {}

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.gameMode = +params['mode'];
      if (this.gameMode === 2) {
        this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
          .catch(error => console.error("Erro ao inicializar FaceMesh:", error));
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.gameMode = +params['mode'];
      if (this.gameMode === 2) {
        this.ReconhecimentoOcular = true;
        this.iniciarSelecao();
      }
    });

    this.blinkSubscription = this.blinkService.blinkDetected.subscribe(() => {
      if (this.gameMode === 2 && this.gameActive) {
        this.onBlinkDetected();
      }
    });
  
    this.initializePlacar();
  }

  private initializePlacar() {
   this.placarService.MaioresPontuacoes(1, this.gameMode).subscribe(
    (response: { pontuacao: number; Jogador: string }[]) => {
      this.listaPontuacoes = Array.isArray(response) ? response : []; // Verifica se é um array
    },
    error => {
      console.error('Erro ao obter maiores pontuações:', error);
      this.listaPontuacoes = []; // Garante que a lista está vazia em caso de erro
    }
  );

  }
  
  

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
    if (this.modalTimer) {
      clearTimeout(this.modalTimer); 
    }
    this.gameActive = false; 

    if (this.ReconhecimentoOcular) {
      this.blinkService.stopCamera(this.videoElement.nativeElement);
    }
  }

  iniciarSelecao() {
    if (this.gameActive) {
      this.subscription = interval(1500).subscribe(() => {
        if (this.gameActive) {
          this.atualizarSelecao();
        }
      });
    }
  }

  atualizarSelecao() {
    const previousCell = document.getElementById(`cell${this.selectedIndex}`);
    if (previousCell) {
      previousCell.classList.remove('selected');
    }

    do {
      this.selectedIndex = (this.selectedIndex + 1) % 9;
    } while (document.getElementById(`cell${this.selectedIndex}`)?.classList.contains('marcada'));

    const currentCell = document.getElementById(`cell${this.selectedIndex}`);
    if (currentCell) {
      currentCell.classList.add('selected');
    }
  }

  selecionarCelula(index: number) {
    if (!this.cellValues[index] && this.gameActive) {
      this.cellValues[index] = 'X';
      const jogadorCell = document.getElementById(`cell${index}`);

      if (jogadorCell) {
        jogadorCell.classList.add('marcada');
        jogadorCell.classList.add('jogador');
        jogadorCell.innerHTML = 'X';
      }

      const vencedor = this.verificarVencedor();
      if (vencedor) {
        this.gameActive = false; // O jogo não está mais ativo
        return;
      }

      this.botHasPlayed = false;

      setTimeout(() => this.jogadaBot(), 100);
    }
  }

  private jogadaBot() {
    if (this.botHasPlayed || !this.gameActive) return;

    let availableCells: number[] = [];
    for (let i = 0; i < 9; i++) {
      if (!this.cellValues[i]) {
        availableCells.push(i);
      }
    }

    if (availableCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCells.length);
      const botCellIndex = availableCells[randomIndex];
      this.cellValues[botCellIndex] = 'O';
      const botCell = document.getElementById(`cell${botCellIndex}`);
      if (botCell) {
        botCell.classList.add('marcada');
        botCell.classList.add('bot');
        botCell.innerHTML = 'O';
      }

      const vencedor = this.verificarVencedor();
      if (vencedor) {
        this.gameActive = false; // O jogo não está mais ativo
        return;
      }

      this.botHasPlayed = true;
    }
  }

  private onBlinkDetected() {
    this.selecionarCelula(this.selectedIndex);
  }

  private verificarVencedor(): string | null {
    const combinacoesVitoria = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combinacao of combinacoesVitoria) {
        const [a, b, c] = combinacao;
        if (this.cellValues[a] && this.cellValues[a] === this.cellValues[b] && this.cellValues[a] === this.cellValues[c]) {
            if (this.cellValues[a] === 'X') {
                this.showVitoria = true; // Habilita a vitória para 'X'
            } else if (this.cellValues[a] === 'O') {
                this.showDerrota = true; // Habilita a derrota para 'O'
            }
            this.gameActive = false; // O jogo não está mais ativo

            // Reinicia o jogo após 5 segundos
            this.modalTimer = setTimeout(() => {
              this.reiniciarJogo();
            }, 5000);

            return this.cellValues[a];
        }
    }

    if (!this.cellValues.includes(null)) {
      this.showEmpate = true;
      // Reinicia o jogo após 5 segundos
      this.modalTimer = setTimeout(() => {
        this.reiniciarJogo();
      }, 5000);
    }

    return null;
  }

  private reiniciarJogo() {
    this.gameActive = false; // Desativar o jogo antes de reiniciar.

    // Limpar todos os valores das células
    this.cellValues.fill(null);

    // Remover marcações e conteúdo de todas as células no DOM
    for (let index = 0; index < this.cellValues.length; index++) {
      const cell = document.getElementById(`cell${index}`);
      if (cell) {
        cell.classList.remove('marcada', 'jogador', 'bot'); // Remover todas as classes
        cell.innerHTML = ''; // Limpar o conteúdo da célula
      }
    }

    // Resetar estados do jogo
    this.selectedIndex = 0;
    this.gameActive = true;
    this.showVitoria = false;
    this.showDerrota = false;
    this.showEmpate = false;
    this.botHasPlayed = false;

    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
      this.modalTimer = null;
    }

    this.route.params.subscribe(params => {
      this.gameMode = +params['mode'];
      if (this.gameMode === 2) {
        this.iniciarSelecao();
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
