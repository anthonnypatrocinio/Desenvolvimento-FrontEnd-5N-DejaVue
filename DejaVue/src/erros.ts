import { ErroHttp } from './api'

// A API respondeu 404: o id pedido não existe (diferente de "a API caiu").
export function ehNaoEncontrado(erro: unknown): boolean {
  return erro instanceof ErroHttp && erro.status === 404
}

// Transforma o erro técnico numa frase que a pessoa entende.
// `acao` completa "Não foi possível ...", por exemplo "carregar as tarefas".
export function mensagemDeErro(erro: unknown, acao: string): string {
  // A API respondeu, mas com erro (500, 403...): o código ajuda o grupo a investigar
  if (erro instanceof ErroHttp) {
    return `Não foi possível ${acao}: o servidor respondeu com o erro ${erro.status}.`
  }
  // fetch rejeita com TypeError quando a requisição nem chega ao servidor
  // (json-server desligado, sem internet)
  if (erro instanceof TypeError) {
    return `Não foi possível ${acao}. Verifique se o json-server está rodando e tente de novo.`
  }
  return `Aconteceu um erro inesperado ao tentar ${acao}.`
}
