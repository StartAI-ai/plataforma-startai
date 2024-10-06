import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { UtilService } from '../../../service/util.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private utilService: UtilService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, senha } = this.loginForm.value;
  
      this.authService.login(email, senha).subscribe({
        next: (response) => {
          if (response.user) {
            console.log(response) 
            localStorage.setItem('userData', JSON.stringify(response.user));
            this.router.navigate(['/home']); 
          } else {
            console.error('Login falhou', response);
          }
        },
        error: (error) => {
          this.utilService.showSnackbar(error);
        }
      });
    } else {
      this.utilService.showSnackbar('Formulário inválido. Verifique os campos.');
    }
  }
  
  cadastrar(): void{
    this.router.navigate(['/cadastro']);
  }
}
