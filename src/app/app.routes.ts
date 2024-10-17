import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/auth/login/login.component';
import { CadastroComponent } from '../pages/auth/cadastro/cadastro.component';
import { AuthGuard } from '../auth/Auth.guard';
import { UnAuthGuard } from '../auth/UnAuth.guard';
import { HomeComponent } from '../pages/home/home.component';
import { MemoriaComponent } from '../pages/jogos/memoria/memoria.component';
import { VelhaComponent } from '../pages/jogos/velha/velha.component';
<<<<<<< HEAD
import { DadosComponent } from '../pages/perfil/dados/dados.component';
import { EmailComponent } from '../pages/perfil/email/email.component';
import { SenhaComponent } from '../pages/perfil/senha/senha.component';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [UnAuthGuard] },
  {path: 'cadastro',component: CadastroComponent,},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'jogo-memoria/:mode', component: MemoriaComponent, canActivate: [AuthGuard],},
  {path: 'jogo-velha/:mode', component: VelhaComponent, canActivate: [AuthGuard],},
  {path: 'perfil-dados', component: DadosComponent },
  {path: 'email-dados', component: EmailComponent},
  {path: 'senha-dados', component: SenhaComponent},
=======
import { ControleComponent } from '../pages/controle/controle.component';
import { RedirectGuard } from '../auth/RedirectGuard.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [UnAuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [UnAuthGuard] },
    { path: 'cadastro', component: CadastroComponent, canActivate: [UnAuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'jogo-memoria/:mode', component: MemoriaComponent, canActivate: [AuthGuard] },
    { path: 'jogo-velha/:mode', component: VelhaComponent, canActivate: [AuthGuard] },
    { path: 'jogo-pescaria/:mode', component: MemoriaComponent, canActivate: [AuthGuard] },
    { path: 'jogo-batalha/:mode', component: VelhaComponent, canActivate: [AuthGuard] },
    { path: 'controle/:jogo', component: ControleComponent, canActivate: [AuthGuard] }
>>>>>>> bae1369044d1dd9c18e3d09063dacd5be9337560
];
