import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { CadastroComponent } from '../pages/cadastro/cadastro.component';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { AuthGuard } from '../auth/Auth.guard';
import { UnAuthGuard } from '../auth/UnAuth.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent, canActivate: [UnAuthGuard] },
    { path: 'cadastro', component: CadastroComponent, canActivate: [UnAuthGuard] },
    { path: 'home', component: InicioComponent, canActivate: [AuthGuard] }
];
