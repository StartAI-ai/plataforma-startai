import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BlinkService } from '../../../service/blink.service';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-velha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './velha.component.html',
  styleUrl: './velha.component.css'
})
export class VelhaComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private subscription: Subscription | undefined;
  private blinkSubscription: Subscription | undefined;

  selectedIndex: number = 0;
  botHasPlayed: boolean = false; // Flag para controlar a jogada do bot
  cellValues: (string | null)[] = Array(9).fill(null); // Para armazenar os valores das células

  constructor(private blinkService: BlinkService) {}

  ngAfterViewInit(): void {
    this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
      .catch(error => console.error("Erro ao inicializar FaceMesh:", error));
  }

  ngOnInit() {
    this.startSelection();

    // Subscribe to blink detection
    this.blinkSubscription = this.blinkService.blinkDetected.subscribe(() => {
      this.onBlinkDetected();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
  }

  startSelection() {
    this.subscription = interval(1500).subscribe(() => {
      this.updateSelection();
    });
  }

  updateSelection() {
    const previousCell = document.getElementById(`cell${this.selectedIndex}`);
    if (previousCell) {
      previousCell.classList.remove('selected');
    }

    // Loop até encontrar uma célula não marcada
    do {
      this.selectedIndex = (this.selectedIndex + 1) % 9;
    } while (document.getElementById(`cell${this.selectedIndex}`)?.classList.contains('marcada'));

    const currentCell = document.getElementById(`cell${this.selectedIndex}`);
    if (currentCell) {
      currentCell.classList.add('selected');
    }
  }

  selectCell(index: number) {
    if (!this.cellValues[index]) {
      this.cellValues[index] = 'X'; // Atualiza cellValues antes de marcar a célula
      const jogadorCell = document.getElementById(`cell${index}`);
  
      if (jogadorCell) {
        jogadorCell.classList.add('marcada'); 
        jogadorCell.classList.add('jogador'); 
        jogadorCell.innerHTML = 'X'; 
      }
  
      this.botHasPlayed = false; // Reseta a flag após o jogador jogar
  
      // Após o jogador selecionar uma célula, o bot faz sua jogada
      setTimeout(() => this.botPlay(), 100); // Espera meio segundo para o bot jogar
    }
  }
  

  private botPlay() {
    if (this.botHasPlayed) return; // Verifica se o bot já jogou nesta rodada

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
      this.botHasPlayed = true; 
    }
    }

  private onBlinkDetected() {
    this.selectCell(this.selectedIndex); // Seleciona a célula atualmente destacada ao piscar
  }
}
