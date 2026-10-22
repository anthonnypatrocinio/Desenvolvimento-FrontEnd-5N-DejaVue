<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import type { NovoProjeto } from '../api'

// Só os campos que o usuário digita: o criadoEm é preenchido pela tela, não aqui.
export type DadosProjeto = Pick<NovoProjeto, 'nome' | 'descricao' | 'disciplina'>

const props = defineProps<{ inicial?: DadosProjeto; enviando?: boolean }>()
const emit = defineEmits<{ enviar: [dados: DadosProjeto] }>()

// Cópia local: o formulário edita a cópia, nunca a prop.
const dados = reactive<DadosProjeto>(
  props.inicial ? { ...props.inicial } : { nome: '', descricao: '', disciplina: '' },
)
const erros = ref<Partial<Record<keyof DadosProjeto, string>>>({})
const quantidadeErros = ref(0)
const formulario = ref<HTMLFormElement | null>(null)
let tentouEnviar = false

function validar(): boolean {
  const e: typeof erros.value = {}
  if (!dados.nome.trim()) e.nome = 'Informe o nome do projeto.'
  if (!dados.disciplina.trim()) e.disciplina = 'Informe a disciplina.'
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
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    disciplina: dados.disciplina.trim(),
  })
}
</script>

<template>
  <form ref="formulario" class="formulario" novalidate @submit.prevent="aoEnviar">
    <p v-if="quantidadeErros > 0" class="resumo" role="alert">
      ⚠ Corrija {{ quantidadeErros }} {{ quantidadeErros === 1 ? 'campo' : 'campos' }} antes de salvar.
    </p>
    <p class="legenda"><span aria-hidden="true">*</span> campo obrigatório</p>
    
    <div class="campo">
      <label for="nome">Nome <span aria-hidden="true">*</span></label>
      <input
        id="nome"
        v-model="dados.nome"
        type="text"
        aria-required="true"
        :aria-invalid="erros.nome ? 'true' : undefined"
        :aria-describedby="erros.nome ? 'erro-nome' : undefined"
      />
      <p v-if="erros.nome" id="erro-nome" class="erro">⚠ Erro: {{ erros.nome }}</p>
    </div>

    <div class="campo">
      <label for="descricao">Descrição</label>
      <textarea id="descricao" v-model="dados.descricao" rows="3"></textarea>
    </div>

    <div class="campo">
      <label for="disciplina">Disciplina <span aria-hidden="true">*</span></label>
      <input
        id="disciplina"
        v-model="dados.disciplina"
        type="text"
        aria-required="true"
        :aria-invalid="erros.disciplina ? 'true' : undefined"
        :aria-describedby="erros.disciplina ? 'erro-disciplina' : undefined"
      />
      <p v-if="erros.disciplina" id="erro-disciplina" class="erro">⚠ Erro: {{ erros.disciplina }}</p>
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

input,
textarea {
  padding: 0.4rem 0.5rem;
  font: inherit;
}

.erro {
  margin: 0;
  color: #b91c1c;
  font-weight: 600;
}

.resumo {
  margin: 0;
  padding: 0.5rem 0.75rem;
  border: 2px solid #b91c1c;
  border-radius: 6px;
  color: #b91c1c;
  font-weight: 600;
}

.legenda {
  margin: 0;
  font-size: 0.85rem;
}

[aria-invalid='true'] {
  border: 2px solid #b91c1c;
}

input:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 3px solid #6d28d9;
  outline-offset: 2px;
}

button {
  min-height: 2.5rem;
  padding: 0 1rem;
  font: inherit;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>