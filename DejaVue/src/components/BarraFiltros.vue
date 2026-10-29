<script setup lang="ts">
import { useFiltros } from '../composables/useFiltros'
import { opcoesPrioridade, opcoesStatus, rotuloPrioridade, rotuloStatus } from '../rotulos'

// Sem props: lê e escreve direto no estado compartilhado (M426).
// Por isso a lista e o quadro mostram a MESMA busca e os MESMOS filtros.
const { busca, status, prioridade } = useFiltros()
</script>

<template>
  <div class="barra" role="search" aria-label="Buscar e filtrar tarefas">
    <div class="campo busca">
      <label for="busca">Buscar por título</label>
      <input id="busca" v-model="busca" type="search" placeholder="Ex.: quadro" autocomplete="off" />
    </div>

    <div class="campo">
      <label for="filtro-status">Status</label>
      <select id="filtro-status" v-model="status">
        <option value="">Todos</option>
        <option v-for="s in opcoesStatus" :key="s" :value="s">{{ rotuloStatus[s] }}</option>
      </select>
    </div>

    <div class="campo">
      <label for="filtro-prioridade">Prioridade</label>
      <select id="filtro-prioridade" v-model="prioridade">
        <option value="">Todas</option>
        <option v-for="p in opcoesPrioridade" :key="p" :value="p">{{ rotuloPrioridade[p] }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.barra {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 2rem;
  margin: 0.6rem 0 1.2rem;
}
.campo {
  display: grid;
  gap: 0.1rem;
  min-width: 11rem;
}
.campo.busca {
  flex: 1 1 16rem;
}
</style>
