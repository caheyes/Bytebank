//Decorators são um recurso experimental do Typescript que permite adicionar anotações e metaprogramação às declarações de classe e membros. Decorators são funções que podem ser aplicadas usando a forma @expressão, onde expressão deve ser avaliada como uma função que será chamada em tempo de execução com informações sobre a declaração decorada. Decorators podem ser usados para modificar o comportamento, adicionar novas características ou observar as declarações decoradas.
//Existem diferentes tipos de decorators, como decorators de classe, decorators de método, decorators de propriedade e decorators de parâmetro. Cada tipo de decorator tem uma assinatura específica e recebe diferentes argumentos. Decorators podem ser compostos ou criados por fábricas de decorators para personalizar a sua aplicação.
export function ValidaDebito(target, propertyKey, descriptor) {
    // Guarda uma referência ao método original
    const originalMethod = descriptor.value;
    // Substitui o método original por uma nova função
    descriptor.value = function (valorDoDebito) {
        if (valorDoDebito <= 0) {
            throw new Error('O valor a ser debitado precisa ser maior do que zero!');
        }
        ;
        if (valorDoDebito > this.saldo) {
            throw new Error('O seu saldo é insuficiente para realizar a operação!');
        }
        ;
        // Chama o método original com os argumentos originais
        return originalMethod.apply(this, [valorDoDebito]);
    };
    return descriptor;
}
;
export function ValidaDeposito(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (valorDoDeposito) {
        if (valorDoDeposito <= 0) {
            throw new Error('O valor a ser depositado deve ser maior do que zero!');
        }
        ;
        return originalMethod.apply(this, [valorDoDeposito]);
    };
    return descriptor;
}
