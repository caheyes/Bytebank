import Conta from "../types/ContaNova.js";
import ExtratoComponent from "./extrato-components.js";
import SaldoComponent from "./saldo-components.js";
const elementoFormulario = document.querySelector('.block-nova-transacao form');
elementoFormulario.addEventListener('submit', function (event) {
    try {
        //previne com carregamento page
        event.preventDefault();
        if (!elementoFormulario.checkValidity()) {
            alert('Por favor, preencha todos os campos da transação!');
            return;
        }
        const inputTipoTransacao = elementoFormulario.querySelector('#tipoTransacao');
        const inputValor = elementoFormulario.querySelector('#valor');
        const inputData = elementoFormulario.querySelector('#data');
        //as converte o tipo
        let tipoTransacao = inputTipoTransacao.value;
        let valor = inputValor.valueAsNumber;
        let data = new Date(inputData.value + ' 00:00:00');
        console.log(data);
        const novaTransacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data,
        };
        Conta.registrarTransacao(novaTransacao);
        SaldoComponent.atualizar();
        ExtratoComponent.atualizar();
        elementoFormulario.reset();
    }
    catch (erro) {
        alert(erro.message);
    }
});
