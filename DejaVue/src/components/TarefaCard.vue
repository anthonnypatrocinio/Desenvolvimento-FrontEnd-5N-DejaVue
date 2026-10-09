<script setup lang="ts">
import type { Prioridade, Status, Tarefa } from '../tipos'

defineProps<{ tarefa: Tarefa }>()

const rotuloStatus: Record<Status, string> = {
  'a-fazer': 'A fazer',
  'em-andamento': 'Em andamento',
  'em-revisao': 'Em revisão',
  concluida: 'Concluída',
}

const rotuloPrioridade: Record<Prioridade, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
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
        <dd>{{ rotuloStatus[tarefa.status] }}</dd>
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
</style>
