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

  }

  batalha(): void {

  }

  velha(): void {
    if (this.userData) {
      if(this.userData.controleId == 1){
        this.router.navigate(['controle','jogo-velha']);
      } else{
        this.router.navigate(['jogo-velha', this.userData.controleId]);
      }
    }
  }

  memoria(): void {
    if (this.userData) {
      if(this.userData.controleId == 1){
        this.router.navigate(['controle','jogo-memoria']);
      } else{
        this.router.navigate(['jogo-memoria', this.userData.controleId]);
      }
    }
  }

}
