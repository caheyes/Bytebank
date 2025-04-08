import { Armazenador } from "./Armazenador.js";
import { ValidaDebito, ValidaDeposito } from "./Decorators.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { ResumoTransacoes } from "./ResumoTransacoes.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
  //variables
  protected nome: string; //encapsulamento 
  protected saldo: number = Armazenador.obter<number>('saldo') || 0; //<number> definindo o que retornar vai ser um numero
  private transacoes: Transacao[] = Armazenador.obter<Transacao[]>(('transacoes'), (key: string, value: any) => {
    if(key === 'data') {
      return new Date(value);
    };

    return value;
  }) || [];

  constructor(nome: string) {
    this.nome = nome; //obrigatorio
  };
  
  //methods
  //get
  public getTitular(): string {
    return this.nome;
  };

  public getGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(this.transacoes); //copia structuredClone para não atingir as transações originais
    const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
    let labelAtualGroupTransacao: string = '';

    for(let transacao of transacoesOrdenadas) {
      let labelGrupoTransacao: string = transacao.data.toLocaleDateString('pt-br', { month:'long', year: 'numeric' });
      if(labelAtualGroupTransacao != labelGrupoTransacao){
        labelAtualGroupTransacao = labelGrupoTransacao;

        gruposTransacoes.push({
          label: labelGrupoTransacao,
          transacoes: []
        });
      };
      
      // .at(-1) pega o último elemento do array.
      // adicionando a transação na lista por último do seu grupo
      gruposTransacoes.at(-1).transacoes.push(transacao);
    };

    return gruposTransacoes;
  };

  public getSaldo() {
    return this.saldo;
  };

  public getDataAcesso(): Date {
    return new Date();
  };

  //util
  public registrarTransacao(novaTransacao: Transacao): void {
    if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      this.depositar(novaTransacao.valor);
    } else if (
      novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA ||
      novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO
    ) {
      this.debitar(novaTransacao.valor);
      novaTransacao.valor *= -1; //deixando valor negativo
    } else {
      throw new Error('Tipo de Transação é inválido!');
    };

    this.transacoes.push(novaTransacao);
    //stringify transformando em string
    Armazenador.salvar('transacoes', this.transacoes);
    this.agruparTransacoes();
  };

  @ValidaDebito
  private debitar(valor: number): void {
    this.saldo -= valor;
    Armazenador.salvar('saldo', this.saldo);
  };

  @ValidaDeposito
  private depositar(valor: number): void {
    this.saldo += valor;
    Armazenador.salvar('saldo', this.saldo);
  };

  public agruparTransacoes(): ResumoTransacoes {
    const resumo: ResumoTransacoes = {
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
  };
};

//extends Conta (herança), tudo que tiver em conta vai ter ma premium
export class ContaPremium extends Conta {
  registrarTransacao(transacao: Transacao): void {
    if(transacao.tipoTransacao === TipoTransacao.DEPOSITO) {
      console.log('Ganhou bônus de 0.50 centavos');
      transacao.valor += 0.5;
    };

    //super para usar itens da classe, pai mae usando o Conta
    super.registrarTransacao(transacao);
  };

}

const conta = new Conta('Caroline Souza');
const contaPremium = new ContaPremium('Renato Toshio');

export default conta;