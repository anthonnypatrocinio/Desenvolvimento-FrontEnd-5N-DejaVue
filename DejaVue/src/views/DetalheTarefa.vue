<script setup lang="ts">
import { ref, watch } from "vue";
import { buscarProjeto, buscarTarefa } from "../api";
import type { Prioridade, Projeto, Status, Tarefa } from "../tipos";

// O roteador (issue #10) entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>();

const rotuloStatus: Record<Status, string> = {
  "a-fazer": "A fazer",
  "em-andamento": "Em andamento",
  "em-revisao": "Em revisão",
  concluida: "Concluída",
};

const rotuloPrioridade: Record<Prioridade, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

// O prazo é texto "AAAA-MM-DD". Trocar a ordem evita o fuso horário do Date.
const formatarPrazo = (prazo: string) => prazo.split("-").reverse().join("/");

const tarefa = ref<Tarefa | null>(null);
const projeto = ref<Projeto | null>(null);
const carregando = ref(true);
const erro = ref("");

async function carregar(id: string) {
  carregando.value = true;
  erro.value = "";
  tarefa.value = null;
  projeto.value = null;

  try {
    const encontrada = await buscarTarefa(id);
    // Se o id mudou enquanto esperava a resposta, descarta o resultado antigo
    if (id !== props.id) return;
    tarefa.value = encontrada;

    // O nome do projeto é um extra: se falhar, a tarefa continua aparecendo
    try {
      projeto.value = await buscarProjeto(encontrada.projetoId);
    } catch {
      projeto.value = null;
    }
  } catch (e) {
    if (id !== props.id) return;
    erro.value =
      e instanceof Error && e.message === "HTTP 404"
        ? "Tarefa não encontrada."
        : "Não foi possível carregar a tarefa. O json-server está rodando?";
  } finally {
    if (id === props.id) carregando.value = false;
  }
}

// immediate: busca ao abrir a tela; refaz a busca se o id da URL mudar
watch(() => props.id, carregar, { immediate: true });
</script>

<template>
  <section class="detalhe">
    <RouterLink to="/" class="voltar">← Voltar para a lista</RouterLink>

    <p v-if="carregando">Carregando...</p>
    <p v-else-if="erro" role="alert">{{ erro }}</p>

    <article v-else-if="tarefa">
      <h1>{{ tarefa.titulo }}</h1>

      <dl class="campos">
        <dt>Descrição</dt>
        <dd>{{ tarefa.descricao }}</dd>

        <dt>Status</dt>
        <dd>{{ rotuloStatus[tarefa.status] }}</dd>

        <dt>Prioridade</dt>
        <dd>{{ rotuloPrioridade[tarefa.prioridade] }}</dd>

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
.detalhe {
  padding: 1.5rem;
  text-align: left;
}
.voltar {
  display: inline-block;
  margin-bottom: 1rem;
}
.campos {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1.5rem;
  margin: 0;
}
dt {
  opacity: 0.7;
}
dd {
  margin: 0;
}
</style>
