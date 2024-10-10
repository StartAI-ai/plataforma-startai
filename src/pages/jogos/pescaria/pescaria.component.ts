import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface Fish {
  x: number;
  y: number;
  size: number;
  points: number;
  color: string;
}

@Component({
  selector: 'app-pescaria',
  templateUrl: './pescaria.component.html',
  styleUrls: ['./pescaria.component.css']
})
export class PescariaComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;

  // Variáveis de controle
  powerLevel = 50;
  score = 0;
  timeRemaining = 120; // 2 minutos de jogo
  gameInterval: any;
  fishes: Fish[] = [];
  peixeNaVara: Fish[] = []; // Peixes que aparecerão na vara
  isCatchingFish = false; // Se o jogador está capturando peixes ou não

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
    const fishColors = ['#FF6347', '#FFD700', '#00FF7F', '#00CED1'];
    const fishes: Fish[] = [];

    for (let i = 0; i < 10; i++) {
      const fish: Fish = {
        x: Math.random() * 600 + 50,
        y: Math.random() * 300 + 50,
        size: Math.random() * 30 + 10,
        points: Math.floor(Math.random() * 10 + 1),
        color: fishColors[Math.floor(Math.random() * fishColors.length)],
      };
      fishes.push(fish);
    }

    return fishes;
  }

  captureFish() {
    // Simular o tempo que o jogador acerta
    const acerto = Math.random() < 0.5; // 50% de chance de sucesso

    if (acerto) {
      this.isCatchingFish = true;
      // Se o jogador acertar o tempo, captura 3 peixes
      this.peixeNaVara = this.fishes.slice(0, 3);
      this.score += this.peixeNaVara.reduce((total, fish) => total + fish.points, 0);
    } else {
      // Se errar, captura 1 peixe
      const peixe = this.fishes[0];
      this.peixeNaVara = [peixe];
      this.score += peixe.points;
    }

    // Remover os peixes capturados do array original
    this.fishes = this.fishes.slice(this.peixeNaVara.length);

    if (this.fishes.length < 3) {
      this.fishes = this.fishes.concat(this.generateFishes());
    }

    // Após a captura, resetar o estado de captura
    setTimeout(() => {
      this.isCatchingFish = false;
      this.peixeNaVara = [];
    }, 2000);
  }

  drawGame(ctx: CanvasRenderingContext2D) {
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Limpar tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar vara de pesca (exemplo básico)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(canvas.width / 2 - 10, 50, 20, 100); // Vara de pesca estática

    // Desenhar peixes capturados na vara
    this.peixeNaVara.forEach((fish, index) => {
      ctx.fillStyle = fish.color;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 160 + index * 40, fish.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Desenhar placar
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${this.score}`, 20, 30);
    ctx.fillText(`Tempo: ${this.timeRemaining}s`, 20, 60);

    // Repetir animação
    requestAnimationFrame(() => this.drawGame(ctx));
  }
}
