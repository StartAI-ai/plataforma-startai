import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-termos-de-uso',
  standalone: true,
  imports: [],
  templateUrl: './termos-de-uso.component.html',
  styleUrl: './termos-de-uso.component.css'
})
export class TermosDeUsoComponent {
  
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  politicaPrivacidade(): void {
    this.router.navigate(['politica']);
  }
}
