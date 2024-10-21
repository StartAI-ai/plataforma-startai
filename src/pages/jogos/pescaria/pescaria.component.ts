import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalNovoJogoComponent } from '../../../componentes/modal-novo-jogo/modal-novo-jogo.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pescaria',
  standalone: true,
  imports: [CommonModule, ModalNovoJogoComponent],
  templateUrl: './pescaria.component.html',
  styleUrls: ['./pescaria.component.css'],
})
export class PescariaComponent implements OnInit {
  @ViewChild('barraAzul') barraAzul!: ElementRef;
  peixes: { x: number; y: number; imagem: string }[] = [];
  showVitoria: boolean = false;
  showDerrota: boolean = false;
  posicaoBarraX: number = 200; // Posição inicial da barra
  pontos: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.criarPeixes();
    this.posicionarBarraInicial();
  }

  criarPeixes() {
    for (let i = 0; i < 3; i++) {
      this.peixes.push({
        x: Math.random() * 400, // Largura da tela
        y: Math.random() * 300, // Altura da tela
        imagem: `../../../assets/img/pescaria/peixe${i + 1}.png`, // Caminho da imagem do peixe
      });
    }
  }

  posicionarBarraInicial() {
    this.barraAzul.nativeElement.style.left = `${this.posicaoBarraX}px`;
    this.barraAzul.nativeElement.style.bottom = '0px';
  }

  moverBarra(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.posicaoBarraX = Math.max(0, this.posicaoBarraX - 10);
    } else if (event.key === 'ArrowRight') {
      this.posicaoBarraX = Math.min(400, this.posicaoBarraX + 10);
    }
    this.posicionarBarraInicial();
  }

  pescar(peixe: any) {
    const barraRect = this.barraAzul.nativeElement.getBoundingClientRect();
    const peixeRect = { left: peixe.x, right: peixe.x + 30, top: peixe.y, bottom: peixe.y + 20 };

    if (
      barraRect.left < peixeRect.right &&
      barraRect.right > peixeRect.left &&
      barraRect.top < peixeRect.bottom &&
      barraRect.bottom > peixeRect.top
    ) {
      this.pontos += 10;
      this.peixes = this.peixes.filter((p) => p !== peixe);

      if (this.pontos >= 30) {
        this.showVitoria = true;
      }
    }
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
