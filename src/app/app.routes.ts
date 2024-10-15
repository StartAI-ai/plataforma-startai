import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/auth/login/login.component';
import { CadastroComponent } from '../pages/auth/cadastro/cadastro.component';
import { AuthGuard } from '../auth/Auth.guard';
import { UnAuthGuard } from '../auth/UnAuth.guard';
import { HomeComponent } from '../pages/home/home.component';
import { MemoriaComponent } from '../pages/jogos/memoria/memoria.component';
import { VelhaComponent } from '../pages/jogos/velha/velha.component';
import { PescariaComponent } from '../pages/jogos/pescaria/pescaria.component';
import { BatalhaComponent } from '../pages/jogos/batalha/batalha.component';

export const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [UnAuthGuard] },
    { path: 'cadastro', component: CadastroComponent, canActivate: [UnAuthGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'jogo-memoria/:mode', component: MemoriaComponent, canActivate: [AuthGuard] },
    { path: 'jogo-velha/:mode', component: VelhaComponent, canActivate: [AuthGuard] },
    { path: 'jogo-pescaria/:mode', component: PescariaComponent, canActivate: [AuthGuard] },
    { path: 'jogo-batalha/:mode', component: BatalhaComponent, canActivate: [AuthGuard] }
];
