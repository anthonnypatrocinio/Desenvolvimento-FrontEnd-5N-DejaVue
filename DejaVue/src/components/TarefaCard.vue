<script setup lang="ts">
import { computed, ref } from 'vue'
import { opcoesStatus, rotuloPrioridade, rotuloStatus } from '../rotulos'
import type { Status, Tarefa } from '../tipos'

// `arrastavel` liga o arrastar-e-soltar (usado no quadro). Na lista fica desligado.
const props = defineProps<{ tarefa: Tarefa; arrastavel?: boolean }>()

// O cartão não altera a prop: só avisa o pai, que grava e atualiza a lista.
const emit = defineEmits<{ 'mudar-status': [id: Tarefa['id'], status: Status] }>()

function aoMudarStatus(evento: Event) {
  const novo = (evento.target as HTMLSelectElement).value as Status
  emit('mudar-status', props.tarefa.id, novo)
}

// Arrastar: o cartão só "carrega" o id; quem recebe (a coluna) decide o que fazer.
const arrastando = ref(false)
function aoComecarArrasto(evento: DragEvent) {
  arrastando.value = true
  evento.dataTransfer?.setData('text/plain', String(props.tarefa.id))
  if (evento.dataTransfer) evento.dataTransfer.effectAllowed = 'move'
}

// O prazo é texto "AAAA-MM-DD". Trocar a ordem evita o fuso horário do Date.
const formatarPrazo = (prazo: string) => prazo.split('-').reverse().join('/')

// "AAAA-MM-DD" de hoje no fuso local; textos nesse formato podem ser comparados direto.
const hoje = new Date().toLocaleDateString('sv-SE')
const atrasada = computed(() => props.tarefa.status !== 'concluida' && props.tarefa.prazo < hoje)
const concluida = computed(() => props.tarefa.status === 'concluida')

// "!", "!!" ou "!!!" escritos com caneta, conforme a prioridade
const exclamacoes = computed(() => ({ baixa: '!', media: '!!', alta: '!!!' })[props.tarefa.prioridade])

// Cada post-it fica um pouco torto, sempre do mesmo jeito (calculado do id e do título)
const semente = computed(() => {
  let h = 7
  for (const c of String(props.tarefa.id) + props.tarefa.titulo) h = (h * 31 + c.charCodeAt(0)) % 9973
  return h
})
const estilo = computed(() => ({
  '--giro': `${((semente.value % 41) - 20) / 10}deg`,
  '--atraso': `${(semente.value % 6) * 70}ms`,
}))
</script>

<template>
  <article
    class="nota"
    :class="{ atrasada, arrastando, arrastavel }"
    :style="estilo"
    :data-status="tarefa.status"
    :data-prioridade="tarefa.prioridade"
    :draggable="arrastavel ? 'true' : undefined"
    @dragstart="aoComecarArrasto"
    @dragend="arrastando = false"
  >
    <span class="fita" aria-hidden="true"></span>

    <header class="topo">
      <h3 class="titulo">
        <RouterLink :to="`/tarefas/${tarefa.id}`">{{ tarefa.titulo }}</RouterLink>
      </h3>
      <span class="urgencia">
        <span class="so-leitor">Prioridade {{ rotuloPrioridade[tarefa.prioridade].toLowerCase() }}</span>
        <span aria-hidden="true">{{ exclamacoes }}</span>
      </span>
    </header>

    <div class="status">
      <label :for="`status-${tarefa.id}`" class="so-leitor">Mudar o status de {{ tarefa.titulo }}</label>
      <select :id="`status-${tarefa.id}`" :value="tarefa.status" @change="aoMudarStatus">
        <option v-for="s in opcoesStatus" :key="s" :value="s">{{ rotuloStatus[s] }}</option>
      </select>

      <!-- carimbos: aparecem batendo no papel -->
      <span v-if="atrasada" class="carimbo carimbo--atraso">
        <span class="so-leitor">Tarefa </span>atrasada
      </span>
      <span v-else-if="concluida" class="carimbo carimbo--feito" aria-hidden="true">feito!</span>
    </div>

    <footer class="rodape">
      <span><span class="rotulo">de</span> {{ tarefa.responsavel }}</span>
      <span class="prazo">
        <span class="rotulo">até</span>
        <time :datetime="tarefa.prazo">{{ formatarPrazo(tarefa.prazo) }}</time>
      </span>
    </footer>
  </article>
</template>

<style scoped>
.nota {
  --nota: var(--nota-a-fazer);
  --fita-cor: var(--mt-azul);
  --urgencia: var(--pr-baixa);
  --giro: 0deg;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 11.5rem;
  padding: 1.5rem 1.1rem 0.9rem;
  border-radius: 3px 3px 6px 30px / 3px 3px 6px 6px;
  background: linear-gradient(172deg, color-mix(in srgb, var(--nota) 72%, #fff) 0%, var(--nota) 38%);
  box-shadow: var(--sombra-nota);
  transform: rotate(var(--giro));
  animation: cair 0.55s cubic-bezier(0.3, 1.3, 0.5, 1) var(--atraso, 0ms) backwards;
  transition:
    transform 0.28s cubic-bezier(0.3, 1.6, 0.5, 1),
    box-shadow 0.28s ease;
}
.nota[data-status='em-andamento'] {
  --nota: var(--nota-em-andamento);
}
.nota[data-status='em-revisao'] {
  --nota: var(--nota-em-revisao);
}
.nota[data-status='concluida'] {
  --nota: var(--nota-concluida);
}
.nota[data-prioridade='media'] {
  --fita-cor: var(--mt-laranja);
  --urgencia: var(--pr-media);
}
.nota[data-prioridade='alta'] {
  --fita-cor: var(--mt-rosa);
  --urgencia: var(--pr-alta);
}

/* o post-it "levanta" e fica reto quando você aponta para ele */
.nota:hover,
.nota:focus-within {
  z-index: 5;
  transform: rotate(0deg) translateY(-8px) scale(1.03);
  box-shadow:
    0 2px 2px rgba(0, 0, 0, 0.12),
    0 24px 28px -14px rgba(0, 0, 0, 0.5);
}
.nota.arrastavel {
  cursor: grab;
}
.nota.arrastando {
  opacity: 0.45;
  transform: rotate(5deg) scale(0.94);
}

/* fita adesiva (a cor mostra a prioridade) */
.fita {
  position: absolute;
  top: -0.7rem;
  left: 50%;
  width: 5rem;
  height: 1.5rem;
  margin-left: -2.5rem;
  background:
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.5) 0 5px, rgba(255, 255, 255, 0.15) 5px 10px),
    var(--fita-cor);
  opacity: 0.9;
  transform: rotate(-3deg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
}
.titulo {
  font: 700 1.9rem/1.02 var(--f-titulo);
}
.titulo a {
  color: var(--tinta);
  text-decoration: none;
  /* marca-texto que cresce no hover */
  background: linear-gradient(var(--mt-amarelo), var(--mt-amarelo)) 0 88% / 0% 55% no-repeat;
  transition: background-size 0.3s ease;
}
.titulo a:hover {
  background-color: transparent;
  background-size: 100% 55%;
}
/* concluída: riscada com caneta vermelha */
.nota[data-status='concluida'] .titulo a {
  color: color-mix(in srgb, var(--tinta) 65%, #fff);
  background: linear-gradient(var(--vermelho), var(--vermelho)) 0 55% / 100% 3px no-repeat;
  animation: riscar 0.5s ease-out 0.3s both;
}
@keyframes riscar {
  from {
    background-size: 0% 3px;
  }
  to {
    background-size: 100% 3px;
  }
}

.urgencia {
  flex: none;
  font: 1.9rem/1 var(--f-marca);
  color: var(--urgencia);
  transform: rotate(8deg);
  letter-spacing: -0.05em;
}

/* o select é uma etiqueta escrita à mão */
.status {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.6rem;
}
.status select {
  width: auto;
  max-width: 100%;
  padding: 0.05rem 1.8rem 0.05rem 0.7rem;
  border: 2px dashed var(--lapis);
  border-radius: var(--rabisco);
  background-color: rgba(255, 255, 255, 0.5);
  background-position: right 0.55rem center;
  color: var(--lapis);
  font-size: 1.15rem;
}
.status select:hover {
  background-color: rgba(255, 255, 255, 0.85);
}
.status select option {
  background: var(--papel);
}

.rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.2rem 1rem;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 2px dotted color-mix(in srgb, var(--lapis) 45%, transparent);
  font-size: 1.15rem;
}
.rotulo {
  font: 0.7rem var(--f-maquina);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--lapis) 70%, transparent);
}
.nota.atrasada .prazo {
  color: var(--vermelho);
  font-weight: 700;
  /* data circulada com caneta vermelha */
}
.nota.atrasada .prazo time {
  padding: 0 0.4rem;
  border: 2px solid var(--vermelho);
  border-radius: var(--rabisco);
}

/* carimbos */
.carimbo {
  margin-left: auto;
  padding: 0 0.45rem;
  border: 3px solid currentColor;
  border-radius: 6px;
  font: 1.1rem/1.35 var(--f-marca);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.85;
  mix-blend-mode: multiply;
  pointer-events: none;
  transform: rotate(-8deg);
  animation: carimbar 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.5) 0.35s both;
}
.carimbo--atraso {
  color: var(--vermelho);
}
.carimbo--feito {
  color: var(--st-concluida);
}
@keyframes carimbar {
  from {
    opacity: 0;
    transform: rotate(-24deg) scale(2.4);
  }
  to {
    opacity: 0.85;
    transform: rotate(-8deg) scale(1);
  }
}

@keyframes cair {
  from {
    opacity: 0;
    transform: translateY(-34px) rotate(calc(var(--giro) + 9deg));
  }
  to {
    opacity: 1;
    transform: rotate(var(--giro));
  }
}
</style>
