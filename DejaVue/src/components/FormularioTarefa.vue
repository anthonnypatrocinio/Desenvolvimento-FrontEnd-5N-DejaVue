<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { listarProjetos } from "../api";
import {
  opcoesPrioridade,
  opcoesStatus,
  rotuloPrioridade,
  rotuloStatus,
} from "../rotulos";
import type { NovaTarefa, Projeto } from "../tipos";

const props = defineProps<{
  inicial?: NovaTarefa;
  projetoIdInicial?: string;
}>();

const emit = defineEmits<{ enviar: [dados: NovaTarefa] }>();

const vazio = (): NovaTarefa => ({
  projetoId: props.projetoIdInicial ?? "",
  titulo: "",
  descricao: "",
  status: "a-fazer",
  prioridade: "media",
  responsavel: "",
  prazo: "",
});

const dados = reactive<NovaTarefa>(
  props.inicial ? { ...props.inicial } : vazio(),
);

watch(
  () => props.inicial,
  (novo) => {
    if (novo) Object.assign(dados, novo);
  },
);

const projetos = ref<Projeto[]>([]);
const erroProjetos = ref("");

onMounted(async () => {
  try {
    projetos.value = await listarProjetos();
    if (!dados.projetoId && projetos.value.length > 0) {
      dados.projetoId = projetos.value[0]!.id;
    }
  } catch {
    erroProjetos.value =
      "Não foi possível carregar os projetos. O json-server está rodando?";
  }
});

function aoEnviar() {
  emit("enviar", { ...dados });
}
</script>

<template>
  <form class="formulario" @submit.prevent="aoEnviar">
    <div class="campo">
      <label for="titulo">Título</label>
      <input id="titulo" v-model="dados.titulo" type="text" />
    </div>

    <div class="campo">
      <label for="descricao">Descrição</label>
      <textarea id="descricao" v-model="dados.descricao" rows="3"></textarea>
    </div>

    <div class="campo">
      <label for="status">Status</label>
      <select id="status" v-model="dados.status">
        <option v-for="s in opcoesStatus" :key="s" :value="s">
          {{ rotuloStatus[s] }}
        </option>
      </select>
    </div>

    <div class="campo">
      <label for="prioridade">Prioridade</label>
      <select id="prioridade" v-model="dados.prioridade">
        <option v-for="p in opcoesPrioridade" :key="p" :value="p">
          {{ rotuloPrioridade[p] }}
        </option>
      </select>
    </div>

    <div class="campo">
      <label for="responsavel">Responsável</label>
      <input id="responsavel" v-model="dados.responsavel" type="text" />
    </div>

    <div class="campo">
      <label for="prazo">Prazo</label>
      <input id="prazo" v-model="dados.prazo" type="date" />
    </div>

    <div class="campo">
      <label for="projeto">Projeto</label>
      <select id="projeto" v-model="dados.projetoId">
        <option v-for="p in projetos" :key="p.id" :value="p.id">
          {{ p.nome }}
        </option>
      </select>
      <p v-if="erroProjetos" role="alert">{{ erroProjetos }}</p>
    </div>

    <button type="submit">Salvar</button>
  </form>
</template>

<style scoped>
.formulario {
  display: grid;
  gap: 1rem;
  max-width: 32rem;
  text-align: left;
}

.campo {
  display: grid;
  gap: 0.25rem;
}

input,
textarea,
select {
  padding: 0.4rem 0.5rem;
  font: inherit;
}
</style>