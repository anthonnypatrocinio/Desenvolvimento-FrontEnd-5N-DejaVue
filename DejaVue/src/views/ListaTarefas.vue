<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listarTarefas } from '../api'
import type { Tarefa } from '../tipos'
import TarefaCard from '../components/TarefaCard.vue'

const tarefas = ref<Tarefa[]>([])

onMounted(async () => {
  tarefas.value = await listarTarefas()
})
</script>

<template>
  <section>
    <h1>Tarefas</h1>
    <div class="lista">
      <TarefaCard v-for="t in tarefas" :key="t.id" :tarefa="t" />
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
