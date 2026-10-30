<script setup lang="ts">
import { computed, ref } from 'vue'
import { listarTarefas } from '../api'
import AlternarVisao from '../components/AlternarVisao.vue'
import BarraFiltros from '../components/BarraFiltros.vue'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import TarefaCard from '../components/TarefaCard.vue'
import { useCarregar } from '../composables/useCarregar'
import { useFiltros } from '../composables/useFiltros'
import { useMudarStatus } from '../composables/useMudarStatus'
import { opcoesStatus, rotuloStatus } from '../rotulos'
import type { Status, Tarefa } from '../tipos'

const { dados: tarefas, carregando, erro } = useCarregar(listarTarefas)

// Arrastar e soltar: a coluna sob o ponteiro fica destacada; ao soltar, o status muda.
// (O select do cartão continua existindo: é a alternativa para quem usa só o teclado.)
const sobre = ref<Status | null>(null)

function passandoSobre(evento: DragEvent, destino: Status) {
  evento.preventDefault() // sem isso o navegador não aceita soltar aqui
  if (evento.dataTransfer) evento.dataTransfer.dropEffect = 'move'
  sobre.value = destino
}

function saiuDaColuna(evento: DragEvent) {
  // dragleave também dispara ao passar sobre os filhos: só limpa ao sair de verdade
  const coluna = evento.currentTarget as HTMLElement
  if (!coluna.contains(evento.relatedTarget as Node | null)) sobre.value = null
}

function soltar(evento: DragEvent, destino: Status) {
  evento.preventDefault()
  sobre.value = null
  const id = evento.dataTransfer?.getData('text/plain')
  const tarefa = tarefas.value?.find((t) => String(t.id) === id)
  if (tarefa) mudar(tarefa.id, destino)
}
const { aplicarFiltros } = useFiltros()
const { erroStatus, mudarStatus } = useMudarStatus()

function mudar(id: Tarefa['id'], novo: Status) {
  if (tarefas.value) mudarStatus(tarefas.value, id, novo)
}

// Uma coluna por status, na ordem de opcoesStatus, já respeitando busca e filtros.
// Quando o status de uma tarefa muda, o computed recalcula e o cartão troca de coluna.
const colunas = computed(() => {
  const visiveis = aplicarFiltros(tarefas.value ?? [])
  return opcoesStatus.map((s) => ({
    status: s,
    titulo: rotuloStatus[s],
    tarefas: visiveis.filter((t) => t.status === s),
  }))
})
</script>

<template>
  <section class="quadro">
    <header class="pagina-topo">
      <div>
        <span class="sobre">Fluxo de trabalho</span>
        <h1>Quadro</h1>
      </div>
      <RouterLink to="/tarefas/nova" class="botao botao--destaque">+ Nova tarefa</RouterLink>
    </header>

    <AlternarVisao />
    <BarraFiltros />

    <p v-if="erroStatus" role="alert">{{ erroStatus }}</p>

    <EstadoCarregando v-if="carregando" />
    <p v-else-if="erro" role="alert">Não foi possível carregar as tarefas.</p>
    <div v-else class="colunas">
      <section
        v-for="c in colunas"
        :key="c.status"
        class="coluna"
        :class="{ 'solta-aqui': sobre === c.status }"
        :data-status="c.status"
        :aria-labelledby="`coluna-${c.status}`"
        @dragover="passandoSobre($event, c.status)"
        @dragleave="saiuDaColuna"
        @drop="soltar($event, c.status)"
      >
        <h2 :id="`coluna-${c.status}`">
          {{ c.titulo }} <span class="contagem">{{ c.tarefas.length }}</span>
        </h2>
        <p v-if="c.tarefas.length === 0" class="vazio">{{ sobre === c.status ? 'solte aqui!' : 'nada por aqui ainda' }}</p>
        <TarefaCard
          v-for="t in c.tarefas"
          :key="t.id"
          :tarefa="t"
          arrastavel
          @mudar-status="mudar"
        />
      </section>
    </div>
  </section>
</template>

<style scoped>
.colunas {
  display: grid;
  grid-template-columns: repeat(4, minmax(235px, 1fr));
  gap: 1.4rem;
  overflow-x: auto;
  padding: 1rem 0.4rem 1.5rem;
  scroll-snap-type: x proximity;
}
/* cada coluna é um retângulo desenhado a caneta, com a cor do status */
.coluna {
  --cor: var(--st-a-fazer);
  --fundo: var(--nota-a-fazer);
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  min-width: 0;
  min-height: 14rem;
  padding: 0.9rem 0.9rem 1.4rem;
  border: 2.5px dashed var(--cor);
  border-radius: var(--rabisco-2);
  background: color-mix(in srgb, var(--fundo) 20%, transparent);
  scroll-snap-align: start;
  transition:
    background 0.2s,
    transform 0.2s cubic-bezier(0.3, 1.5, 0.5, 1);
}
.coluna[data-status='em-andamento'] {
  --cor: var(--st-em-andamento);
  --fundo: var(--nota-em-andamento);
}
.coluna[data-status='em-revisao'] {
  --cor: var(--st-em-revisao);
  --fundo: var(--nota-em-revisao);
}
.coluna[data-status='concluida'] {
  --cor: var(--st-concluida);
  --fundo: var(--nota-concluida);
}
/* ao arrastar um post-it por cima: a coluna "acende" */
.coluna.solta-aqui {
  background: color-mix(in srgb, var(--fundo) 65%, transparent);
  border-style: solid;
  transform: scale(1.02) rotate(0.4deg);
}
.coluna h2 {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 2.1rem;
  color: var(--cor);
}
.contagem {
  margin-left: auto;
  display: inline-grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  border: 2.5px solid var(--cor);
  border-radius: var(--rabisco);
  font: 700 1.4rem/1 var(--f-mao);
  color: var(--cor);
}
.vazio {
  padding: 1.4rem 0.5rem;
  font: 1.5rem var(--f-titulo);
  text-align: center;
  color: color-mix(in srgb, var(--cor) 70%, transparent);
}
.solta-aqui .vazio {
  color: var(--cor);
}
</style>
