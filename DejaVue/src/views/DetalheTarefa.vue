<script setup lang="ts">
import { computed } from 'vue'
import { buscarProjeto, buscarTarefa } from '../api'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import EstadoErro from '../components/EstadoErro.vue'
import { useCarregar } from '../composables/useCarregar'
import { mensagemDeErro } from '../erros'
import type { Prioridade, Status } from '../tipos'

// O roteador entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>()

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

// A tarefa é obrigatória; o nome do projeto é um extra:
// se ele falhar, a tarefa continua aparecendo (com "Projeto N" no lugar do nome).
async function buscarDetalhe(id: string) {
  const tarefa = await buscarTarefa(id)
  const projeto = await buscarProjeto(tarefa.projetoId).catch(() => null)
  return { tarefa, projeto }
}

// O segundo argumento manda buscar de novo quando o :id da URL mudar
const { dados, carregando, erro, recarregar } = useCarregar(() => buscarDetalhe(props.id), () => props.id)
const tarefa = computed(() => dados.value?.tarefa ?? null)
const projeto = computed(() => dados.value?.projeto ?? null)
</script>

<template>
  <section class="detalhe">
    <RouterLink to="/" class="voltar">← Voltar para a lista</RouterLink>

    <EstadoCarregando v-if="carregando" />
    <EstadoErro v-else-if="erro" :mensagem="mensagemDeErro(erro, 'carregar a tarefa')" @tentar-novamente="recarregar" />

    <article v-else-if="tarefa">
      <header class="pagina-topo">
        <div>
          <span class="sobre">Tarefa #{{ tarefa.id }}</span>
          <h1>{{ tarefa.titulo }}</h1>
        </div>
        <RouterLink :to="`/tarefas/${tarefa.id}/editar`" class="botao botao--suave">Editar</RouterLink>
      </header>

      <div class="chips">
        <span class="chip" :data-status="tarefa.status">{{ rotuloStatus[tarefa.status] }}</span>
        <span class="chip" :data-prioridade="tarefa.prioridade">Prioridade {{ rotuloPrioridade[tarefa.prioridade].toLowerCase() }}</span>
      </div>

      <dl class="campos">
        <dt>Descrição</dt>
        <dd>{{ tarefa.descricao }}</dd>

        <dt>Responsável</dt>
        <dd>{{ tarefa.responsavel }}</dd>

        <dt>Prazo</dt>
        <dd>{{ formatarPrazo(tarefa.prazo) }}</dd>

        <dt>Projeto</dt>
        <dd>
          <RouterLink :to="`/projetos/${tarefa.projetoId}`">
            {{ projeto ? projeto.nome : `Projeto ${tarefa.projetoId}` }}
          </RouterLink>
        </dd>
      </dl>
    </article>
  </section>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 0.4rem 0 1.6rem;
}
/* ficha com campos "para preencher" */
.campos {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.2rem 1.6rem;
  max-width: 44rem;
  margin: 0;
}
dt {
  align-self: end;
  font: 0.8rem var(--f-maquina);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--suave);
  padding-bottom: 0.25rem;
}
dd {
  margin: 0;
  padding: 0.2rem 0.2rem;
  border-bottom: 2px dotted color-mix(in srgb, var(--tinta) 55%, transparent);
  font-size: 1.35rem;
  color: var(--tinta);
}
@media (max-width: 560px) {
  .campos {
    grid-template-columns: 1fr;
  }
  dt {
    padding-top: 0.6rem;
  }
}
</style>
