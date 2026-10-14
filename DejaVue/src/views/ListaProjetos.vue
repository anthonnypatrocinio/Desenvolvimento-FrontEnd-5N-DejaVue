<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { listarProjetos } from '../api'
import type { Projeto } from '../tipos'

const projetos = ref<Projeto[]>([])
const carregando = ref(true)

onMounted(async () => {
  try {
    projetos.value = await listarProjetos()
  } catch (erro) {
    console.error('Erro ao buscar projetos:', erro)
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <section>
    <h1>Lista de Projetos</h1>

    <p v-if="carregando">Carregando projetos...</p>

    <ul v-else-if="projetos.length > 0">
      <li v-for="projeto in projetos" :key="projeto.id">
        <RouterLink :to="`/projetos/${projeto.id}`">
          {{ projeto.nome }}
        </RouterLink>
      </li>
    </ul>

    <p v-else>Nenhum projeto encontrado.</p>
  </section>
</template>