<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
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
const formulario = ref<HTMLFormElement | null>(null)
const quantidadeErros = ref(0)

function validar(): boolean {
  const e: Erros = {}
  if (!dados.titulo.trim()) e.titulo = 'Informe o título.'
  if (!dados.responsavel.trim()) e.responsavel = 'Informe o responsável.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.prazo)) e.prazo = 'Informe o prazo.'
  if (!dados.projetoId) e.projetoId = 'Escolha um projeto.'
  erros.value = e
  quantidadeErros.value = Object.keys(e).length
  return quantidadeErros.value === 0
}

watch(dados, () => {
  if (tentouEnviar) validar()
})

async function aoEnviar() {
  if (props.enviando) return
  tentouEnviar = true
  if (!validar()) {
    await nextTick()
    formulario.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }

  emit('enviar', {
    ...dados,
    titulo: dados.titulo.trim(),
    responsavel: dados.responsavel.trim(),
  })
}
</script>

<template>
  <form ref="formulario" class="formulario" novalidate @submit.prevent="aoEnviar">
    <p v-if="quantidadeErros > 0" class="resumo" role="alert">
      ⚠️ Corrija {{ quantidadeErros }} {{ quantidadeErros === 1 ? 'campo' : 'campos' }} antes de salvar.
    </p>

    <p class="legenda"><span aria-hidden="true">*</span> campo obrigatório</p>

    <div class="campo">
      <label for="titulo">Título <span aria-hidden="true">*</span></label>
      <input
        id="titulo"
        v-model="dados.titulo"
        type="text"
        aria-required="true"
        :aria-invalid="erros.titulo ? 'true' : undefined"
        :aria-describedby="erros.titulo ? 'erro-titulo' : undefined"
      />
      <p v-if="erros.titulo" id="erro-titulo" class="erro">Erro: {{ erros.titulo }}</p>
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
      <label for="responsavel">Responsável <span aria-hidden="true">*</span></label>
      <input
        id="responsavel"
        v-model="dados.responsavel"
        type="text"
        aria-required="true"
        :aria-invalid="erros.responsavel ? 'true' : undefined"
        :aria-describedby="erros.responsavel ? 'erro-responsavel' : undefined"
      />
      <p v-if="erros.responsavel" id="erro-responsavel" class="erro">Erro: {{ erros.responsavel }}</p>
    </div>

    <div class="campo">
      <label for="prazo">Prazo <span aria-hidden="true">*</span></label>
      <input
        id="prazo"
        v-model="dados.prazo"
        type="date"
        aria-required="true"
        :aria-invalid="erros.prazo ? 'true' : undefined"
        :aria-describedby="erros.prazo ? 'erro-prazo' : undefined"
      />
      <p v-if="erros.prazo" id="erro-prazo" class="erro">Erro: {{ erros.prazo }}</p>
    </div>

    <div class="campo">
      <label for="projeto">Projeto <span aria-hidden="true">*</span></label>
      <select
        id="projeto"
        v-model="dados.projetoId"
        aria-required="true"
        :aria-invalid="erros.projetoId ? 'true' : undefined"
        :aria-describedby="erros.projetoId ? 'erro-projeto' : undefined"
      >
        <option v-for="p in projetos" :key="p.id" :value="p.id">{{ p.nome }}</option>
      </select>
      <p v-if="erros.projetoId" id="erro-projeto" class="erro">Erro: {{ erros.projetoId }}</p>
      <p v-if="erroProjetos" role="alert">{{ erroProjetos }}</p>
    </div>

    <button type="submit" :disabled="enviando">{{ enviando ? 'Salvando...' : 'Salvar' }}</button>
  </form>
</template>

<style scoped>
.formulario {
  display: grid;
  gap: 0.9rem;
  max-width: 34rem;
}
.campo {
  display: grid;
  gap: 0.1rem;
}
.campo > label span {
  color: var(--vermelho);
}
.erro {
  margin: 0;
  color: var(--vermelho);
  font-size: 1.1rem;
}
.resumo {
  margin: 0;
  padding: 0.5rem 0.9rem;
  border: 2px dashed var(--vermelho);
  border-radius: var(--rabisco-2);
  background: color-mix(in srgb, var(--vermelho) 7%, var(--papel));
  color: var(--vermelho);
  font-size: 1.2rem;
  transform: rotate(-0.6deg);
}
.legenda {
  margin: 0;
  font: 0.8rem var(--f-maquina);
  color: var(--suave);
}
.formulario button[type='submit'] {
  justify-self: start;
  margin-top: 0.4rem;
  background: var(--mt-verde);
}
</style>
