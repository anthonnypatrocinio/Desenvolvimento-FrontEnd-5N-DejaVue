<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '../api'
import type { Tarefa } from '../tipos'
import AlternarVisao from '../components/AlternarVisao.vue'
import BarraFiltros from '../components/BarraFiltros.vue'
import TarefaCard from '../components/TarefaCard.vue'
import { useFiltros } from '../composables/useFiltros'
import { useMudarStatus } from '../composables/useMudarStatus'

const tarefas = ref<Tarefa[]>([])
const { aplicarFiltros } = useFiltros()
const { erroStatus, mudarStatus } = useMudarStatus()

// Só as tarefas que passam pela busca e pelos filtros (a lista original não muda)
const visiveis = computed(() => aplicarFiltros(tarefas.value))

onMounted(async () => {
  tarefas.value = await listarTarefas()
})
</script>

<template>
  <section>
    <header class="pagina-topo">
      <div>
        <span class="sobre">Visão geral</span>
        <h1>Tarefas</h1>
      </div>
      <RouterLink to="/tarefas/nova" class="botao botao--destaque">+ Nova tarefa</RouterLink>
    </header>

    <AlternarVisao />
    <BarraFiltros />

    <p class="resumo" aria-live="polite">{{ visiveis.length }} de {{ tarefas.length }} tarefas</p>
    <p v-if="erroStatus" role="alert">{{ erroStatus }}</p>

    <div class="lista">
      <TarefaCard
        v-for="t in visiveis"
        :key="t.id"
        :tarefa="t"
        @mudar-status="(id, novo) => mudarStatus(tarefas, id, novo)"
      />
    </div>
  </section>
</template>

<style scoped>
.resumo {
  margin-bottom: 0.6rem;
  font: 0.85rem var(--f-maquina);
  letter-spacing: 0.06em;
  color: var(--suave);
}
</style>
