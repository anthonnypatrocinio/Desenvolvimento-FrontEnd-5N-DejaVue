import { ref } from 'vue'
import { excluirTarefa } from '../api'
import { mensagemDeErro } from '../erros'
import type { Tarefa } from '../tipos'

export function useExcluirTarefa() {
  // Cada tela que usa o composable tem a sua própria mensagem (mostrar com role="alert")
  const erroExcluir = ref('')

  // Pede confirmação, apaga na API e, só depois que a API confirmou,
  // tira a tarefa da lista que está na tela (se a tela passou uma).
  // Devolve true se a tarefa foi excluída; false se a pessoa desistiu OU se falhou.
  async function excluir(tarefa: Tarefa, lista?: Tarefa[]): Promise<boolean> {
    erroExcluir.value = ''
    // window.confirm para a página até a pessoa responder: OK = true, Cancelar = false
    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"? Não dá para desfazer.`)) return false

    try {
      await excluirTarefa(tarefa.id)
    } catch (e) {
      // Falhou: não mexemos na lista, então a tarefa continua na tela, como no servidor
      console.error(e)
      erroExcluir.value = `${mensagemDeErro(e, 'excluir a tarefa')} A tarefa continua na lista.`
      return false
    }

    if (lista) {
      const posicao = lista.findIndex((t) => t.id === tarefa.id)
      if (posicao >= 0) lista.splice(posicao, 1) // splice muda o array reativo: a tela atualiza
    }
    return true
  }

  return { erroExcluir, excluir }
}
