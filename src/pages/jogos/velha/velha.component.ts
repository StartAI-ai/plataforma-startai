import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlinkService } from '../../../service/blink.service';

@Component({
  selector: 'app-velha',
  standalone: true,
  imports: [],
  templateUrl: './velha.component.html',
  styleUrl: './velha.component.css'
})
export class VelhaComponent implements OnInit, AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  constructor(private blinkService: BlinkService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
      .catch(error => console.error("Erro ao inicializar FaceMesh:", error));
  }

}
