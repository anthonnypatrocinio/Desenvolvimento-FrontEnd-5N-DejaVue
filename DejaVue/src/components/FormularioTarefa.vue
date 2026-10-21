<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { listarProjetos } from '../api'
import { opcoesPrioridade, opcoesStatus, rotuloPrioridade, rotuloStatus } from '../rotulos'
import type { NovaTarefa, Projeto } from '../tipos'

const props = defineProps<{
  inicial?: NovaTarefa
  projetoIdInicial?: string
  enviando?: boolean
}>()

const emit = defineEmits<{ enviar: [dados: NovaTarefa] }>()

const vazio = (): NovaTarefa => ({
  projetoId: props.projetoIdInicial ?? '',
  titulo: '',
  descricao: '',
  status: 'a-fazer',
  prioridade: 'media',
  responsavel: '',
  prazo: '',
})

const dados = reactive<NovaTarefa>(props.inicial ? { ...props.inicial } : vazio())

watch(
  () => props.inicial,
  (novo) => {
    if (novo) Object.assign(dados, novo)
  },
)

const projetos = ref<Projeto[]>([])
const erroProjetos = ref('')

onMounted(async () => {
  try {
    projetos.value = await listarProjetos()
    if (!dados.projetoId && projetos.value.length > 0) {
      dados.projetoId = projetos.value[0]!.id
    }
  } catch {
    erroProjetos.value = 'Não foi possível carregar os projetos. O json-server está rodando?'
  }
})

type Erros = Partial<Record<keyof NovaTarefa, string>>
const erros = ref<Erros>({})
let tentouEnviar = false

function validar(): boolean {
  const e: Erros = {}
  if (!dados.titulo.trim()) e.titulo = 'Informe o título.'
  if (!dados.responsavel.trim()) e.responsavel = 'Informe o responsável.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.prazo)) e.prazo = 'Informe o prazo.'
  if (!dados.projetoId) e.projetoId = 'Escolha um projeto.'
  erros.value = e
  return Object.keys(e).length === 0
}

watch(dados, () => {
  if (tentouEnviar) validar()
})

function aoEnviar() {
  if (props.enviando) return
  tentouEnviar = true
  if (!validar()) return

  emit('enviar', {
    ...dados,
    titulo: dados.titulo.trim(),
    responsavel: dados.responsavel.trim(),
  })
}
</script>

<template>
  <form class="formulario" novalidate @submit.prevent="aoEnviar">
    <div class="campo">
      <label for="titulo">Título</label>
      <input id="titulo" v-model="dados.titulo" type="text" />
      <p v-if="erros.titulo" class="erro">{{ erros.titulo }}</p>
    </div>

    <div class="campo">
      <label for="descricao">Descrição</label>
      <textarea id="descricao" v-model="dados.descricao" rows="3"></textarea>
    </div>

    <div class="campo">
      <label for="status">Status</label>
      <select id="status" v-model="dados.status">
        <option v-for="s in opcoesStatus" :key="s" :value="s">{{ rotuloStatus[s] }}</option>
      </select>
    </div>

    <div class="campo">
      <label for="prioridade">Prioridade</label>
      <select id="prioridade" v-model="dados.prioridade">
        <option v-for="p in opcoesPrioridade" :key="p" :value="p">{{ rotuloPrioridade[p] }}</option>
      </select>
    </div>

    <div class="campo">
      <label for="responsavel">Responsável</label>
      <input id="responsavel" v-model="dados.responsavel" type="text" />
      <p v-if="erros.responsavel" class="erro">{{ erros.responsavel }}</p>
    </div>

    <div class="campo">
      <label for="prazo">Prazo</label>
      <input id="prazo" v-model="dados.prazo" type="date" />
      <p v-if="erros.prazo" class="erro">{{ erros.prazo }}</p>
    </div>

    <div class="campo">
      <label for="projeto">Projeto</label>
      <select id="projeto" v-model="dados.projetoId">
        <option v-for="p in projetos" :key="p.id" :value="p.id">{{ p.nome }}</option>
      </select>
      <p v-if="erros.projetoId" class="erro">{{ erros.projetoId }}</p>
      <p v-if="erroProjetos" role="alert">{{ erroProjetos }}</p>
    </div>

    <button type="submit" :disabled="enviando">{{ enviando ? 'Salvando...' : 'Salvar' }}</button>
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
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.erro {
  margin: 0;
  color: #b91c1c;
}
input,
textarea,
select {
  padding: 0.4rem 0.5rem;
  font: inherit;
}
</style>

const projetos = ref<Projeto[]>([]);
const tocados = reactive({
  titulo: false,
  projetoId: false,
});

const erros = computed(() => ({
  titulo: !dados.titulo.trim() ? "O título é obrigatório." : "",
  projetoId: !dados.projetoId ? "Selecione um projeto." : "",
}));

const formularioValido = computed(() => {
  return !erros.value.titulo && !erros.value.projetoId;
});

const tentarSubmeter = ref(false);

onMounted(async () => {
  try {
    projetos.value = await listarProjetos();
  } catch (e) {
    console.error("Erro ao carregar projetos", e);
  }
});

watch(
  () => props.inicial,
  (novo) => {
    if (novo) {
      Object.assign(dados, novo);
    }
  }
);

function submeter() {
  tentarSubmeter.value = true;
  tocados.titulo = true;
  tocados.projetoId = true;

  if (!formularioValido.value || props.enviando) {
    return;
  }

  emit("enviar", { ...dados });
}
</script>

<template>
  <form @submit.prevent="submeter" class="formulario-tarefa" novalidate>
    <div class="campo">
      <label for="campo-titulo">Título *</label>
      <input
        id="campo-titulo"
        v-model="dados.titulo"
        type="text"
        @blur="tocados.titulo = true"
      />
      <span
        v-if="erros.titulo && (tocados.titulo || tentarSubmeter)"
        class="mensagem-erro"
      >
        {{ erros.titulo }}
      </span>
    </div>

    <div class="campo">
      <label for="campo-projeto">Projeto *</label>
      <select
        id="campo-projeto"
        v-model="dados.projetoId"
        @blur="tocados.projetoId = true"
      >
        <option value="" disabled>Selecione um projeto...</option>
        <option v-for="proj in projetos" :key="proj.id" :value="proj.id">
          {{ proj.nome }}
        </option>
      </select>
      <span
        v-if="erros.projetoId && (tocados.projetoId || tentarSubmeter)"
        class="mensagem-erro"
      >
        {{ erros.projetoId }}
      </span>
    </div>

    <div class="campo">
      <label for="campo-descricao">Descrição</label>
      <textarea id="campo-descricao" v-model="dados.descricao" rows="3"></textarea>
    </div>

    <div class="campo-grupo">
      <div class="campo">
        <label for="campo-status">Status</label>
        <select id="campo-status" v-model="dados.status">
          <option v-for="st in opcoesStatus" :key="st" :value="st">
            {{ rotuloStatus[st] }}
          </option>
        </select>
      </div>

      <div class="campo">
        <label for="campo-prioridade">Prioridade</label>
        <select id="campo-prioridade" v-model="dados.prioridade">
          <option v-for="pr in opcoesPrioridade" :key="pr" :value="pr">
            {{ rotuloPrioridade[pr] }}
          </option>
        </select>
      </div>
    </div>

    <div class="campo-grupo">
      <div class="campo">
        <label for="campo-responsavel">Responsável</label>
        <input id="campo-responsavel" v-model="dados.responsavel" type="text" />
      </div>

      <div class="campo">
        <label for="campo-prazo">Prazo</label>
        <input id="campo-prazo" v-model="dados.prazo" type="date" />
      </div>
    </div>

    <div class="acoes">
      <button
        type="submit"
        class="botao-salvar"
        :disabled="props.enviando || (tentarSubmeter && !formularioValido)"
      >
        {{ props.enviando ? "A guardar..." : "Salvar Tarefa" }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.formulario-tarefa {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
}
.campo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.campo-grupo {
  display: flex;
  gap: 1rem;
}
.campo-grupo .campo {
  flex: 1;
}
.mensagem-erro {
  color: #d9534f;
  font-size: 0.85rem;
}
.botao-salvar:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style>