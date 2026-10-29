<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buscarTarefa, criarTarefa, listarTarefas } from '../api.ts'
import type { NovaTarefa } from '../tipos.ts'
import FormularioTarefa from '../components/FormularioTarefa.vue'

const route = useRoute()
const router = useRouter()

// Vem do link "Nova tarefa" da página do projeto: /tarefas/nova?projetoId=1
const projetoIdInicial =
  typeof route.query.projetoId === 'string' ? route.query.projetoId : ''

// O id é digitado aqui, junto do formulário. Já vem uma sugestão: o próximo número livre.
const idNovo = ref('')
const enviando = ref(false)
const erro = ref('')

onMounted(async () => {
  try {
    const tarefas = await listarTarefas()
    const numeros = tarefas
      .map((t) => Number(t.id))
      .filter((n) => Number.isInteger(n))
    idNovo.value = String(Math.max(0, ...numeros) + 1)
  } catch {
    // sem sugestão: a pessoa digita o id
  }
})

// A API responde 404 quando não existe tarefa com aquele id
async function idJaExiste(id: string) {
  try {
    await buscarTarefa(id)
    return true
  } catch (e) {
    if (e instanceof Error && e.message === 'HTTP 404') return false
    throw e
  }
}

async function salvar(dados: NovaTarefa) {
  // evita enviar duas vezes se o botão for clicado de novo
  if (enviando.value) return

  const id = idNovo.value.trim()
  if (!id) {
    erro.value = 'Informe o id da tarefa.'
    return
  }
  if (!/^[\w-]+$/.test(id)) {
    erro.value = 'O id só pode ter letras, números, hífen e sublinhado.'
    return
  }

  enviando.value = true
  erro.value = ''
  try {
    if (await idJaExiste(id)) {
      erro.value = `Já existe uma tarefa com o id ${id}.`
      return
    }
    // o id digitado vai junto com os dados do formulário
    const corpo = { id, ...dados }
    await criarTarefa(corpo)
    // grava na API e volta para a lista
    await router.push('/')
  } catch {
    erro.value = 'Não foi possível salvar a tarefa. O json-server está rodando?'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="pagina-form">
    <RouterLink to="/" class="voltar">← Voltar para as tarefas</RouterLink>

    <h1>Nova tarefa</h1>

    <p v-if="erro" role="alert">{{ erro }}</p>
    <p v-if="enviando">Salvando...</p>

    <div class="campo">
      <label for="id">Id</label>
      <input id="id" v-model="idNovo" type="text" />
    </div>

    <FormularioTarefa :projeto-id-inicial="projetoIdInicial" @enviar="salvar" />
  </section>
</template>

<style scoped>
.campo {
  display: grid;
  gap: 0.1rem;
  max-width: 34rem;
  margin-bottom: 1rem;
}
</style>
