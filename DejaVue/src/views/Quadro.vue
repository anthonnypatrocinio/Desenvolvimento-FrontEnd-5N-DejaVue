<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '../api'
import AlternarVisao from '../components/AlternarVisao.vue'
import BarraFiltros from '../components/BarraFiltros.vue'
import TarefaCard from '../components/TarefaCard.vue'
import { useFiltros } from '../composables/useFiltros'
import { useMudarStatus } from '../composables/useMudarStatus'
import { opcoesStatus, rotuloStatus } from '../rotulos'
import type { Tarefa } from '../tipos'

const tarefas = ref<Tarefa[]>([])
const erro = ref('')
const { aplicarFiltros } = useFiltros()
const { erroStatus, mudarStatus } = useMudarStatus()

onMounted(async () => {
  try {
    tarefas.value = await listarTarefas()
  } catch {
    erro.value = 'Não foi possível carregar as tarefas. O json-server está rodando?'
  }
})

// Uma coluna por status, na ordem de opcoesStatus, já respeitando busca e filtros.
// Quando o status de uma tarefa muda, o computed recalcula e o cartão troca de coluna.
const colunas = computed(() => {
  const visiveis = aplicarFiltros(tarefas.value)
  return opcoesStatus.map((s) => ({
    status: s,
    titulo: rotuloStatus[s],
    tarefas: visiveis.filter((t) => t.status === s),
  }))
})
</script>

<template>
  <section class="quadro">
    <h1>Quadro</h1>

    <AlternarVisao />
    <BarraFiltros />

    <p v-if="erro" role="alert">{{ erro }}</p>
    <p v-if="erroStatus" role="alert">{{ erroStatus }}</p>

    <div class="colunas">
      <section
        v-for="c in colunas"
        :key="c.status"
        class="coluna"
        :aria-labelledby="`coluna-${c.status}`"
      >
        <h2 :id="`coluna-${c.status}`">
          {{ c.titulo }} <span class="contagem">{{ c.tarefas.length }}</span>
        </h2>
        <TarefaCard
          v-for="t in c.tarefas"
          :key="t.id"
          :tarefa="t"
          @mudar-status="(id, novo) => mudarStatus(tarefas, id, novo)"
        />
      </section>
    </div>
  </section>
</template>

<style scoped>
.quadro {
  padding: 1.5rem;
  text-align: left;
}
.colunas {
  display: grid;
  grid-template-columns: repeat(4, minmax(260px, 1fr));
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.coluna {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  min-height: 8rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
}
.coluna h2 {
  margin: 0;
  font-size: 1.1rem;
}
.contagem {
  margin-left: 0.25rem;
  opacity: 0.7;
}
</style>
