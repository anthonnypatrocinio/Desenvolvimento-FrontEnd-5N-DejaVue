<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '../api.ts'
import type { Tarefa } from '../tipos.ts'
import TarefaCard from '../components/TarefaCard.vue'
import { useFiltros } from '../composables/useFiltros.ts'

const tarefas = ref<Tarefa[]>([])
const { busca, aplicarFiltros } = useFiltros()

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

    <div class="lista">
      <TarefaCard v-for="t in visiveis" :key="t.id" :tarefa="t" />
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
.campo-busca input {
  padding: 0.4rem 0.5rem;
  font: inherit;
}
.lista {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
