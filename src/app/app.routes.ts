import { Routes } from '@angular/router';
import { InicioComponent } from '../pages/inicio/inicio.component';
import { PescariaComponent } from '../pages/jogos/pescaria/pescaria.component';
import { BatalhaComponent } from '../pages/jogos/batalha/batalha.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'pescaria', component: PescariaComponent },
    { path: 'batalha', component: BatalhaComponent },
];
