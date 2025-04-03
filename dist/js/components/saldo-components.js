import { formatarMoeda } from "../utils/formatters.js";
import Conta from "../types/conta.js";
const elementoSaldo = document.querySelector('.saldo-valor .valor');
renderizarSaldo();
export function renderizarSaldo() {
    if (elementoSaldo != null) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
    ;
}
;
const SaldoComponent = {
    atualizar() {
        renderizarSaldo();
    }
};
export default SaldoComponent;
