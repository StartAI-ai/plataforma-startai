import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalNovoJogoComponent } from '../../../componentes/modal-novo-jogo/modal-novo-jogo.component';

@Component({
  selector: 'app-pescaria',
  standalone: true,
  imports: [CommonModule, ModalNovoJogoComponent], 
  template: `
    <div>
      <div #barraAzul class="barra"></div>
      <app-modal-novo-jogo *ngIf="showDerrota" [title]="'Lamento!! Você perdeu!'" (jogarNovamente)="jogarNovamente()"></app-modal-novo-jogo>
      <app-modal-novo-jogo *ngIf="showVitoria" [title]="'Parabéns! Você venceu!'" (jogarNovamente)="jogarNovamente()"></app-modal-novo-jogo>
    </div>
  `,
  styleUrls: ['./pescaria.component.css']
})
export class PescariaComponent implements OnInit {
  @ViewChild('barraAzul') barraAzul!: ElementRef;

  // Lógica do jogo
  velocidadeDeMovimento: number = 2;
  pontosDoCaminho: { x: number, y: number }[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ];
  pontoAtual: number = 0;
  intervaloMovimento: any;
  showVitoria: boolean = false;
  showDerrota: boolean = false;

  ngOnInit(): void {
    this.posicionarBarraInicial();
    this.iniciarMovimento();
  }

  // Posiciona a barra azul no primeiro ponto
  posicionarBarraInicial() {
    const pontoInicial = this.pontosDoCaminho[this.pontoAtual];
    this.barraAzul.nativeElement.style.left = `${pontoInicial.x}px`;
    this.barraAzul.nativeElement.style.top = `${pontoInicial.y}px`;
  }

  iniciarMovimento() {
    this.intervaloMovimento = setInterval(() => {
      this.movimentarBarraAzul();
    }, 16); // Aproximadamente 60 FPS
  }

  movimentarBarraAzul() {
    const barraElem = this.barraAzul.nativeElement;
    const pontoAlvo = this.pontosDoCaminho[this.pontoAtual];

    const posX = parseFloat(barraElem.style.left);
    const posY = parseFloat(barraElem.style.top);

    // Move a barra na direção do próximo ponto
    const novaPosicaoX = this.mover(posX, pontoAlvo.x);
    const novaPosicaoY = this.mover(posY, pontoAlvo.y);

    barraElem.style.left = `${novaPosicaoX}px`;
    barraElem.style.top = `${novaPosicaoY}px`;

    // Verifica se chegou ao ponto de destino
    if (novaPosicaoX === pontoAlvo.x && novaPosicaoY === pontoAlvo.y) {
      this.pontoAtual += 1;
      // Se a barra atingiu o último ponto, volta para o primeiro
      if (this.pontoAtual >= this.pontosDoCaminho.length) {
        this.pontoAtual = 0;
      }
    }
  }

  mover(posicaoAtual: number, pontoDestino: number): number {
    if (posicaoAtual < pontoDestino) {
      return Math.min(posicaoAtual + this.velocidadeDeMovimento, pontoDestino);
    } else if (posicaoAtual > pontoDestino) {
      return Math.max(posicaoAtual - this.velocidadeDeMovimento, pontoDestino);
    } else {
      return posicaoAtual;
    }
  }

  jogarNovamente() {
    // Lógica para reiniciar o jogo
    this.showVitoria = false;
    this.showDerrota = false;
    this.pontoAtual = 0;
    this.posicionarBarraInicial();
    this.iniciarMovimento();
  }
}
