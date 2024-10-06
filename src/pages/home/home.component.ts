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
    // Your logic here
  }

  batalha(): void {
    // Your logic here
  }

  velha(): void {
    if (this.userData) {
      this.router.navigate(['jogo-velha', this.userData.controleId]); 
    }
  }

  memoria(): void {
    this.router.navigate(['jogo-memoria']); 
  }

}
