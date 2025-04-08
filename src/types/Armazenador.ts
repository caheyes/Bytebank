export class Armazenador {
  private constructor() {}
  //Quando estamos trabalhando com TypeScript, pode ser necessário criar classes e métodos que possam ser acessados sem precisar criar um objeto da classe. Os métodos estáticos são uma maneira poderosa de definir comportamentos e lógicas que podem ser usados diretamente na classe, sem a necessidade de criar objetos.
  static salvar(chave: string, valor: any):void {
    const valorComoString = JSON.stringify(valor);
    localStorage.setItem(chave, valorComoString);
  };

  //tipo T, se referindo a algo generico
  //Ao utilizar generics, podemos parametrizar o tipo de produto que será utilizado na função de calcular o valor total. Isso nos permite manter a flexibilidade de calcular o valor total de diferentes tipos de produtos, sem perder a segurança de tipo fornecida pelo TypeScript. O <T> representa um espaço reservado para o tipo de produto que será determinado no momento da utilização da função de calcular o valor total.
  static obter<T>(chave: string, reviver?: (this: any, key: string, value: any) => any): T | null {
    const valor = localStorage.getItem(chave);

    if(valor === null) {
      return null;
    };

    if(reviver) {
      return JSON.parse(valor, reviver) as T; //reviver é uma função
    };

    return JSON.parse(valor) as T;
  };
}