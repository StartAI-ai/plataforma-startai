import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UtilService } from '../../../service/util.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  cadastroForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private utilService: UtilService) {}

  ngOnInit(): void {
    this.cadastroForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      dataNascimento: new FormControl('', [Validators.required, this.utilService.validarData]),
      controle: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.cadastroForm.valid) {
      const { nome, email, senha, dataNascimento, controle } = this.cadastroForm.value;

      this.authService.cadastro(nome, email, senha, dataNascimento, controle).subscribe({
        next: (response) => {
          this.router.navigate(['/login']); 
        },
        error: (error) => {
          this.utilService.showSnackbar('Erro ao cadastrar usuário. Tente novamente.');
        }
      });
    } else {
      this.utilService.showSnackbar('Formulário inválido. Verifique os campos.');
    }
  }

  login(): void{
    this.router.navigate(['/login']);
  }

}
