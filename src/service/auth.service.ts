import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize, Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://api-53k8.onrender.com';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  // BehaviorSubject para controlar o estado de autenticação
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private router: Router) {}

  // Função de cadastro
  cadastro(nome: string, email: string, senha: string, dataNascimento: string, controle: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.obterUrl('/registrar'), 
      { nome, email, senha, dataNascimento, controle }, 
      this.obterOpcoesHttp()
    ).pipe(
      finalize(() => this.loadingSubject.next(false)),
      catchError(this.tratarErro)
    );
  }

  // Função de login
  login(email: string, senha: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.obterUrl('/login'), 
      { email, senha }, 
      this.obterOpcoesHttp()
    ).pipe(
      finalize(() => this.loadingSubject.next(false)),
      catchError(this.tratarErro)
    );
  }

  // Função para deletar usuário
  deletar(id: number): Observable<any> {
    this.loadingSubject.next(true);
    const url = `/deletar-usuario/${id}`;

    return this.http.delete(this.obterUrl(url), 
      this.obterOpcoesHttp()
    ).pipe(
      finalize(() => this.loadingSubject.next(false)),
      catchError(this.tratarErro)
    );
  }

  // Função para redefinir senha
  redefinirSenha(email: string, senha: string, dataNascimento: string): Observable<any> {
    this.loadingSubject.next(true);
    return this.http.post(this.obterUrl('/redefinir-senha'), 
      { email, senha, dataNascimento }, 
      this.obterOpcoesHttp()
    ).pipe(
      finalize(() => this.loadingSubject.next(false)),
      catchError(this.tratarErro)
    );
  }

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Verifica se está no navegador antes de acessar localStorage
      return !!localStorage.getItem('userData');
    }
    return false; // Caso contrário, assume que o usuário não está autenticado
  }

  // Logout do usuário
  logout(): void {
    localStorage.removeItem('userData'); // Remove os dados do usuário
    this.isAuthenticatedSubject.next(false); // Atualiza o estado de autenticação
    this.router.navigate(['/login']); // Ajuste a rota conforme sua aplicação
  }

  // Métodos auxiliares
  private obterUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  private obterOpcoesHttp() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    return { headers };
  }

  // Tratamento de erros
  private tratarErro(error: any) {
    console.error('Erro na requisição:', error);
    return throwError(() => new Error('Ocorreu um erro. Tente novamente.'));
  }
}
