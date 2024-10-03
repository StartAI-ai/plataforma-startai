import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../componentes/navbar/navbar.component';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {

}
