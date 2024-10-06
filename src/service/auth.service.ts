import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000'; 

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();


  constructor(private http: HttpClient, private router: Router) {}

  // Função de cadastro
  cadastro(nome: string, email: string, senha: string, dataNascimento: string, controle: number): Observable<any> {
    this.loadingSubject.next(true); // Começa a carregar
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  
    return this.http.post(`${this.apiUrl}/registrar`, { nome, email, senha, dataNascimento, controle }, { headers })
      .pipe(finalize(() => this.loadingSubject.next(false))); // Para de carregar ao final
  }
  
  login(email: string, senha: string): Observable<any> {
    this.loadingSubject.next(true); // Começa a carregar
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  
    return this.http.post(`${this.apiUrl}/login`, { email, senha }, { headers })
      .pipe(finalize(() => this.loadingSubject.next(false))); // Para de carregar ao final
  }
  

}
