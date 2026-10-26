<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '../api'
import type { Tarefa } from '../tipos'
import TarefaCard from '../components/TarefaCard.vue'
import { useFiltros } from '../composables/useFiltros'
import { useMudarStatus } from '../composables/useMudarStatus'
import { opcoesPrioridade, opcoesStatus, rotuloPrioridade, rotuloStatus } from '../rotulos'

const tarefas = ref<Tarefa[]>([])
const { busca, status, prioridade, aplicarFiltros } = useFiltros()
const { erroStatus, mudarStatus } = useMudarStatus()

// Só as tarefas que passam pela busca e pelos filtros (a lista original não muda)
const visiveis = computed(() => aplicarFiltros(tarefas.value))

onMounted(async () => {
  tarefas.value = await listarTarefas()
})
</script>

<template>
  <section>
    <h1>Tarefas</h1>
    <RouterLink to="/tarefas/nova">Nova tarefa</RouterLink>

    <div class="campo-busca">
      <label for="busca">Buscar por título</label>
      <input id="busca" v-model="busca" type="search" placeholder="Ex.: quadro" autocomplete="off" />
    </div>

    <div class="filtros">
      <div class="campo-filtro">
        <label for="filtro-status">Status</label>
        <select id="filtro-status" v-model="status">
          <option value="">Todos</option>
          <option v-for="s in opcoesStatus" :key="s" :value="s">{{ rotuloStatus[s] }}</option>
        </select>
      </div>

      <div class="campo-filtro">
        <label for="filtro-prioridade">Prioridade</label>
        <select id="filtro-prioridade" v-model="prioridade">
          <option value="">Todas</option>
          <option v-for="p in opcoesPrioridade" :key="p" :value="p">{{ rotuloPrioridade[p] }}</option>
        </select>
      </div>
    </div>

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
.campo-busca {
  display: grid;
  gap: 0.25rem;
  max-width: 24rem;
  margin: 1rem 0;
  text-align: left;
}
.campo-busca input,
.campo-filtro select {
  padding: 0.4rem 0.5rem;
  font: inherit;
}
.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}
.campo-filtro {
  display: grid;
  gap: 0.25rem;
}
.lista {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
