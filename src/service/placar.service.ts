import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacarService {
  private apiUrl = 'https://api-53k8.onrender.com';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  registrarPlacar(nome: string, email: string, senha: string, dataNascimento: string, controle: number): Observable<any> {
    this.loadingSubject.next(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/registrar`, { nome, email, senha, dataNascimento, controle }, { headers })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        catchError(error => {
          console.error('Erro ao registrar placar:', error);
          return of(null); // Retorna um Observable vazio em caso de erro
        })
      );
  }

  MaioresPontuacoes(id_jogo: number, id_controle: number): Observable<any> {
    this.loadingSubject.next(true);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url = `${this.apiUrl}/maiores-pontuacoes-menos-tempos?id_jogo=${id_jogo}&id_controle=${id_controle}`;

    return this.http.get(url, { headers })
      .pipe(
        finalize(() => this.loadingSubject.next(false)),
        catchError(error => {
          console.error('Erro ao obter maiores pontuações:', error);
          return of([]); // Retorna um array vazio em caso de erro
        })
      );
  }
}
