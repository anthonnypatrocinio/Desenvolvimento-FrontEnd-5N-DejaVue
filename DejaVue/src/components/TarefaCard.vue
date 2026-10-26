<script setup lang="ts">
import { opcoesStatus, rotuloPrioridade, rotuloStatus } from '../rotulos'
import type { Status, Tarefa } from '../tipos'

const props = defineProps<{ tarefa: Tarefa }>()

// O cartão não altera a prop: só avisa o pai, que grava e atualiza a lista.
const emit = defineEmits<{ 'mudar-status': [id: Tarefa['id'], status: Status] }>()

function aoMudarStatus(evento: Event) {
  const novo = (evento.target as HTMLSelectElement).value as Status
  emit('mudar-status', props.tarefa.id, novo)
}

// O prazo é texto "AAAA-MM-DD". Trocar a ordem evita o fuso horário do Date.
const formatarPrazo = (prazo: string) => prazo.split('-').reverse().join('/')
</script>

<template>
  <article class="cartao">
    <h3 class="titulo">
      <RouterLink :to="`/tarefas/${tarefa.id}`">{{ tarefa.titulo }}</RouterLink>
    </h3>
    <dl class="campos">
      <div>
        <dt>Status</dt>
        <dd>
          <label :for="`status-${tarefa.id}`" class="so-leitor">Mudar o status de {{ tarefa.titulo }}</label>
          <select :id="`status-${tarefa.id}`" :value="tarefa.status" @change="aoMudarStatus">
            <option v-for="s in opcoesStatus" :key="s" :value="s">{{ rotuloStatus[s] }}</option>
          </select>
        </dd>
      </div>
      <div>
        <dt>Prioridade</dt>
        <dd>{{ rotuloPrioridade[tarefa.prioridade] }}</dd>
      </div>
      <div>
        <dt>Responsável</dt>
        <dd>{{ tarefa.responsavel }}</dd>
      </div>
      <div>
        <dt>Prazo</dt>
        <dd>{{ formatarPrazo(tarefa.prazo) }}</dd>
      </div>
    </dl>
  </article>
</template>

<style scoped>
.cartao {
  border: 1px solid #8886;
  border-radius: 8px;
  padding: 1rem;
  text-align: left;
}
.titulo {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}
.campos {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 1rem;
  margin: 0;
}
.campos div {
  display: contents;
}
dt {
  opacity: 0.7;
}
dd {
  margin: 0;
}
select {
  max-width: 100%;
  font: inherit;
}
/* Rótulo só para leitor de tela: some da vista, continua na árvore de acessibilidade */
.so-leitor {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
