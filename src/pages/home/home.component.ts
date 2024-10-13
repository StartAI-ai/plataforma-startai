import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null;

  pescaria(): void {
    if (this.userData) {
      this.router.navigate(['jogo-pescaria', this.userData.controleId]);
    }
  }

  batalha(): void {
    if (this.userData) {
      this.router.navigate(['jogo-batalha', this.userData.controleId]);
    }  }

  velha(): void {
    if (this.userData) {
      this.router.navigate(['jogo-velha', this.userData.controleId]);
    }
  }

  memoria(): void {
    if (this.userData) {
      this.router.navigate(['jogo-memoria', this.userData.controleId]);
    }
  }

}
