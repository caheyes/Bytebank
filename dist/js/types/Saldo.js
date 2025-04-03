import { formatarMoeda } from "../utils/formatters.js";
import Conta from "./conta.js";
const elementoSaldo = document.querySelector('.saldo-valor .valor');
function renderizarSaldo() {
    if (elementoSaldo != null) {
        elementoSaldo.textContent = formatarMoeda(Conta.getSaldo());
    }
    ;
}
