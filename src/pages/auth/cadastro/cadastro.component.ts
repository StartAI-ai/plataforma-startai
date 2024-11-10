import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilService } from '../../../service/util.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.cadastroForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      dataNascimento: new FormControl('', [Validators.required, this.utilService.validarData]),
      controle: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      this.cadastrarUsuario();
    } else {
      alert('Formulário inválido. Verifique os campos.');
    }
  }

  private cadastrarUsuario(): void {
    const { username, email, senha, dataNascimento, controle } = this.cadastroForm.value;

    this.authService.cadastro(username, email, senha, dataNascimento, controle).subscribe({
      next: (response) => {
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        const mensagemErro = error.error?.error || 'Erro ao cadastrar usuário. Tente novamente.';
        alert(mensagemErro);
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  redefinirSenha(): void {
    this.router.navigate(['/redefinirSenha']);
  }
}


export function nomeUsuarioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nome = control.value;

    // Valida se o nome é alfanumérico e sem espaços
    const nomeValido = /^[a-zA-Z0-9]+$/.test(nome); // Alfanumérico sem espaços

    if (!nomeValido) {
      return { nomeInvalido: true }; // Retorna erro caso o nome não seja válido
    }

    return null;
  };
}
