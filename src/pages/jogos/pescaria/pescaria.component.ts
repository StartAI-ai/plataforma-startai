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
  styleUrls: ['./pescaria.component.css'],
})
export class PescariaComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>; // Usando '!' para indicar que a inicialização ocorrerá

  private ctx: CanvasRenderingContext2D | null = null;

  // Mudando a visibilidade das propriedades para public
  public powerLevel: number = 0;
  public score: number = 0;
  public timeRemaining: number = 120; // 2 minutos
  private gameInterval: any;

  private fishes: Fish[] = [];

  ngAfterViewInit() {
    this.ctx = this.gameCanvas.nativeElement.getContext('2d');
    this.startGame();
  }

  // Mudando a visibilidade do método startGame
  public startGame() {
    this.resetGame();
    this.gameInterval = setInterval(() => {
      this.updateGame();
      this.drawGame();
    }, 1000 / 60);
  }

  private resetGame() {
    this.score = 0;
    this.timeRemaining = 120;
    this.powerLevel = 0;
    this.fishes = this.generateFishes(10); // Inicia com 10 peixes
    this.countdown();
  }

  private generateFishes(count: number): Fish[] {
    const fishes: Fish[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 20 + 10; // Tamanho aleatório entre 10 e 30
      const depth = Math.random() * 300 + 50; // Profundidade aleatória
      const points = Math.floor(100 / (depth / 50)); // Pontuação baseada na profundidade
      const color = this.getRandomColor(); // Gera uma cor aleatória

      fishes.push({
        x: Math.random() * this.gameCanvas.nativeElement.width,
        y: depth,
        size,
        points,
        color,
      });
    }
    return fishes;
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private countdown() {
    const timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        clearInterval(timer);
        clearInterval(this.gameInterval);
        alert(`Tempo esgotado! Sua pontuação final é: ${this.score}`);
      }
    }, 1000);
  }

  private updateGame() {
    // Atualize a lógica do jogo aqui (se necessário)
  }

  private drawGame() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.gameCanvas.nativeElement.width, this.gameCanvas.nativeElement.height);
      this.drawFishes();
    }
  }

  private drawFishes() {
    if (this.ctx) {
      for (const fish of this.fishes) {
        this.ctx.beginPath();
        this.ctx.arc(fish.x, fish.y, fish.size, 0, Math.PI * 2);
        this.ctx.fillStyle = fish.color; // Define a cor do peixe
        this.ctx.fill();
      }
    }
  }

  // Outros métodos como handleClick, etc.
}
