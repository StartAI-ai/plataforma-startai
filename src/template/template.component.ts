import { Component, HostListener, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../componentes/navbar/navbar.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { LoadingComponent } from '../componentes/loading/loading.component';
import { MemoriaComponent } from "../pages/jogos/memoria/memoria.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, LoadingComponent, MemoriaComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css' 
})
export class TemplateComponent implements OnInit, OnDestroy {

  isDesktop = true;
  isLoading = false;
  isLogado = false;
  private authSubscription: Subscription;

  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLogado = isAuthenticated;
    });

    // Assinaturas para o loading
    this.authService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  ngOnDestroy(): void {
    // Certifique-se de cancelar a inscrição no Observable para evitar vazamentos de memória
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop = window.innerWidth >= 1024; 
    }
  }

}
