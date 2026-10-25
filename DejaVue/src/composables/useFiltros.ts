import { computed, ref } from 'vue'
import type { Prioridade, Status, Tarefa } from '../tipos'

// Estado compartilhado: as ref ficam FORA da função useFiltros().
// Assim existe uma única cópia, usada pela lista, pelo quadro e pela barra de filtros.
const busca = ref('')
const status = ref<Status | ''>('') // '' = todos
const prioridade = ref<Prioridade | ''>('') // '' = todas

// Ignora maiúsculas, minúsculas e acentos: "revisao" encontra "Revisão".
export const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function useFiltros() {
  const filtroAtivo = computed(
    () => busca.value.trim() !== '' || status.value !== '' || prioridade.value !== '',
  )

  // Devolve uma lista nova (não altera a original): busca E status E prioridade.
  function aplicarFiltros(tarefas: Tarefa[]): Tarefa[] {
    const termo = normalizar(busca.value.trim())
    return tarefas.filter(
      (t) =>
        normalizar(t.titulo).includes(termo) &&
        (status.value === '' || t.status === status.value) &&
        (prioridade.value === '' || t.prioridade === prioridade.value),
    )
  }

  function limparFiltros() {
    busca.value = ''
    status.value = ''
    prioridade.value = ''
  }

  return { busca, status, prioridade, filtroAtivo, aplicarFiltros, limparFiltros }
}
