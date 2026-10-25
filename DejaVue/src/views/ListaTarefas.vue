<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listarTarefas } from '../api'
import type { Tarefa } from '../tipos'
import TarefaCard from '../components/TarefaCard.vue'
import { useFiltros } from '../composables/useFiltros'

const tarefas = ref<Tarefa[]>([])
const { aplicarFiltros } = useFiltros()

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
    <div class="lista">
      <TarefaCard v-for="t in visiveis" :key="t.id" :tarefa="t" />
    </div>
  </section>
</template>

<style scoped>
.lista {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
