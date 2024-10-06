import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api-53k8.onrender.com'; 

  constructor(private http: HttpClient, private router: Router) {}

  // Função de cadastro
  cadastro(nome: string, email: string, senha: string, dataNascimento: string, controle: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.post(`${this.apiUrl}/registrar`, { nome, email, senha, dataNascimento, controle }, { headers });
  }

  // Função de login
  login(email: string, senha: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.post(`${this.apiUrl}/login`, { email, senha }, { headers });
  }

}
