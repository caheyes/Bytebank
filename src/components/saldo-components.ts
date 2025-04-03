import { formatarMoeda } from "../utils/formatters.js";
import Conta from "../types/conta.js";

const elementoSaldo = document.querySelector('.saldo-valor .valor') as HTMLElement;

renderizarSaldo();

export function renderizarSaldo(): void {
  if(elementoSaldo != null) {
    elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
  };
} ;

const SaldoComponent = {
  atualizar() {
    renderizarSaldo();
  }
};

export default SaldoComponent;

