import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface Fish {
  x: number;
  y: number;
  size: number;
  points: number;
  color: string; // Nova propriedade para a cor do peixe
}

@Component({
  selector: 'app-pescaria',
  templateUrl: './pescaria.component.html',
  styleUrls: ['./pescaria.component.css']
})
export class PescariaComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  // Variáveis de controle
  powerLevel = 50;  // Inicialmente configurado
  score = 0;
  timeRemaining = 120; // 2 minutos
  gameInterval: any;

  fishes: any[] = [];  // Array de peixes com suas posições e cores

  ngAfterViewInit() {
    const canvas = this.gameCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    this.startGame();

    if (ctx) {
      this.drawGame(ctx);
    }
  }

  startGame() {
    this.score = 0;
    this.timeRemaining = 120;

    // Adicionar peixes iniciais ao jogo
    this.fishes = this.generateFishes();

    // Iniciar o loop do jogo e a lógica de tempo
    this.gameInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(this.gameInterval);
        this.endGame();
      }
    }, 1000);
  }

  endGame() {
    alert(`Tempo esgotado! Sua pontuação: ${this.score}`);
  }

  generateFishes() {
    // Função para gerar peixes aleatórios em diferentes profundidades
    const fishColors = ['#FF6347', '#FFD700', '#00FF7F', '#00CED1'];
    const fishes = [];

    for (let i = 0; i < 10; i++) {
      const fish = {
        x: Math.random() * 600 + 50,  // Posição X aleatória
        y: Math.random() * 300 + 50,  // Posição Y aleatória
        color: fishColors[Math.floor(Math.random() * fishColors.length)],  // Cor aleatória
        points: Math.floor(Math.random() * 10 + 1)  // Pontuação aleatória
      };
      fishes.push(fish);
    }

    return fishes;
  }

  drawGame(ctx: CanvasRenderingContext2D) {
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Limpar tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar peixes
    this.fishes.forEach(fish => {
      ctx.fillStyle = fish.color;
      ctx.beginPath();
      ctx.arc(fish.x, fish.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Exemplo de animação de loop contínuo
    requestAnimationFrame(() => this.drawGame(ctx));
  }
}
