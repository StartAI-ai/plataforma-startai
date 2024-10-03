import { Component } from '@angular/core';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TemplateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'STARTAI';
}
