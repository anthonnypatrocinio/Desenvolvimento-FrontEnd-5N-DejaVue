import { ref } from 'vue'
import { atualizarTarefa } from '../api'
import type { Status, Tarefa } from '../tipos'

// Mensagem de erro compartilhada: cada tela mostra com role="alert".
const erroStatus = ref('')

export function useMudarStatus() {
  // Atualiza a tela na hora (otimista) e grava na API.
  // Se a gravação falhar, volta ao status anterior e avisa.
  async function mudarStatus(tarefas: Tarefa[], id: Tarefa['id'], novo: Status) {
    const tarefa = tarefas.find((t) => t.id === id)
    if (!tarefa || tarefa.status === novo) return
    const anterior = tarefa.status
    erroStatus.value = ''
    tarefa.status = novo
    try {
      await atualizarTarefa(id, { status: novo }) // PATCH só com o status
    } catch {
      tarefa.status = anterior
      erroStatus.value = 'Não foi possível salvar o novo status. O json-server está rodando?'
    }
  }

  return { erroStatus, mudarStatus }
}
