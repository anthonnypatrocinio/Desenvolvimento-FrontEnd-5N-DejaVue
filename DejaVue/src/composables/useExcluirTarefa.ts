import { ref } from 'vue'
import { excluirTarefa } from '../api'
import { mensagemDeErro } from '../erros'
import type { Tarefa } from '../tipos'

export function useExcluirTarefa() {
  const erroExcluir = ref('')

  async function excluir(tarefa: Tarefa, lista?: Tarefa[]): Promise<boolean> {
    erroExcluir.value = ''
    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"? Não dá para desfazer.`)) return false

    try {
      await excluirTarefa(tarefa.id)
    } catch (e) {
      console.error(e)
      erroExcluir.value = `${mensagemDeErro(e, 'excluir a tarefa')} A tarefa continua na lista.`
      return false
    }

    if (lista) {
      const idx = lista.findIndex((t) => t.id === tarefa.id)
      if (idx !== -1) lista.splice(idx, 1)
    }
    return true
  }

  return { erroExcluir, excluir }
}