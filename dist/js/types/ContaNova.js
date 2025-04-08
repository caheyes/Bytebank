var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Armazenador } from "./Armazenador.js";
import { ValidaDebito, ValidaDeposito } from "./Decorators.js";
import { TipoTransacao } from "./TipoTransacao.js";
export class Conta {
    //variables
    nome; //encapsulamento 
    saldo = Armazenador.obter('saldo') || 0; //<number> definindo o que retornar vai ser um numero
    transacoes = Armazenador.obter(('transacoes'), (key, value) => {
        if (key === 'data') {
            return new Date(value);
        }
        ;
        return value;
    }) || [];
    constructor(nome) {
        this.nome = nome; //obrigatorio
    }
    ;
    //methods
    //get
    getTitular() {
        return this.nome;
    }
    ;
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(this.transacoes); //copia structuredClone para não atingir as transações originais
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGroupTransacao = '';
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString('pt-br', { month: 'long', year: 'numeric' });
            if (labelAtualGroupTransacao != labelGrupoTransacao) {
                labelAtualGroupTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            ;
            // .at(-1) pega o último elemento do array.
            // adicionando a transação na lista por último do seu grupo
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }
        ;
        return gruposTransacoes;
    }
    ;
    getSaldo() {
        return this.saldo;
    }
    ;
    getDataAcesso() {
        return new Date();
    }
    ;
    //util
    registrarTransacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA ||
            novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1; //deixando valor negativo
        }
        else {
            throw new Error('Tipo de Transação é inválido!');
        }
        ;
        this.transacoes.push(novaTransacao);
        //stringify transformando em string
        Armazenador.salvar('transacoes', this.transacoes);
        this.agruparTransacoes();
    }
    ;
    debitar(valor) {
        this.saldo -= valor;
        Armazenador.salvar('saldo', this.saldo);
    }
    ;
    depositar(valor) {
        this.saldo += valor;
        Armazenador.salvar('saldo', this.saldo);
    }
    ;
    agruparTransacoes() {
        const resumo = {
            totalDepositos: 0,
            totalTransferencias: 0,
            totalPagamentosBoleto: 0,
        };
        this.transacoes.forEach(transacao => {
            switch (transacao.tipoTransacao) {
                case TipoTransacao.DEPOSITO:
                    resumo.totalDepositos += transacao.valor;
                    break;
                case TipoTransacao.TRANSFERENCIA:
                    resumo.totalTransferencias += transacao.valor;
                    break;
                case TipoTransacao.PAGAMENTO_BOLETO:
                    resumo.totalPagamentosBoleto += transacao.valor;
                    break;
            }
        });
        Armazenador.salvar('resumo', resumo);
        return resumo;
    }
    ;
}
__decorate([
    ValidaDebito
], Conta.prototype, "debitar", null);
__decorate([
    ValidaDeposito
], Conta.prototype, "depositar", null);
;
//extends Conta (herança), tudo que tiver em conta vai ter ma premium
export class ContaPremium extends Conta {
    registrarTransacao(transacao) {
        if (transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            console.log('Ganhou bônus de 0.50 centavos');
            transacao.valor += 0.5;
        }
        ;
        //super para usar itens da classe, pai mae usando o Conta
        super.registrarTransacao(transacao);
    }
    ;
}
const conta = new Conta('Caroline Souza');
const contaPremium = new ContaPremium('Renato Toshio');
export default conta;
