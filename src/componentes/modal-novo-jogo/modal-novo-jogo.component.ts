import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-novo-jogo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-novo-jogo.component.html',
  styleUrl: './modal-novo-jogo.component.css'
})
export class ModalNovoJogoComponent {
  @Input() title: string = '';
}