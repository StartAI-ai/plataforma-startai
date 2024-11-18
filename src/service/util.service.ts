import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  showSnackbar(message: string) {
    const snackbar = document.getElementById('snackbar')!;
    snackbar.innerText = message;
    snackbar.className = 'snackbar show';

    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
    }, 3000); 
  }

  // Validador customizado para a data de nascimento
  dataNascimentoValidator(control: AbstractControl): ValidationErrors | null {
    const dataSelecionada = new Date(control.value);
    const dataHoje = new Date();

    // Verifica se a data é válida
    if (isNaN(dataSelecionada.getTime())) {
      return { 'dataInvalida': true }; // Se a data não for válida
    }

    // Verifica se a data é no futuro
    if (dataSelecionada > dataHoje) {
      return { 'dataFutura': true }; // Se a data for futura
    }

    // Verifica se o ano da data é muito distante (exemplo: abaixo de 1900)
    const anoMinimo = 1900;
    if (dataSelecionada.getFullYear() < anoMinimo) {
      return { 'anoMuitoAntigo': true }; // Se o ano for menor que 1900
    }

    // Verifica se o ano é maior que 2100
    if (dataSelecionada.getFullYear() > 2100) {
      return { 'anoMuitoDistante': true }; // Se o ano for maior que 2100
    }

    return null; // Se a data for válida
  }

}
