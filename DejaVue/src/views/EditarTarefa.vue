<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { buscarTarefa, atualizarTarefa } from '../api.ts'
import type { NovaTarefa } from '../tipos.ts'
import FormularioTarefa from '../components/FormularioTarefa.vue'

// O roteador entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>()
const router = useRouter()

const inicial = ref<NovaTarefa | null>(null)
const carregando = ref(true)
const enviando = ref(false)
const erro = ref('')

async function carregar(id: string) {
  carregando.value = true
  erro.value = ''
  inicial.value = null
  try {
    const tarefa = await buscarTarefa(id)
    // Se o id da URL mudou enquanto esperava, descarta a resposta antiga
    if (id !== props.id) return
    // o formulário trabalha com os campos sem o id
    const { id: _id, ...dados } = tarefa
    inicial.value = dados
  } catch (e) {
    if (id !== props.id) return
    erro.value =
      e instanceof Error && e.message === 'HTTP 404'
        ? 'Tarefa não encontrada.'
        : 'Não foi possível carregar a tarefa. O json-server está rodando?'
  } finally {
    if (id === props.id) carregando.value = false
  }
}

async function salvar(dados: NovaTarefa) {
  // evita enviar duas vezes se o botão for clicado de novo
  if (enviando.value) return
  enviando.value = true
  erro.value = ''
  try {
    // os dados do formulário não têm id, então o id da tarefa não muda
    await atualizarTarefa(props.id, dados)
    // salvou: volta para o detalhe da tarefa
    await router.push(`/tarefas/${props.id}`)
  } catch {
    erro.value = 'Não foi possível salvar as alterações. Tente de novo.'
  } finally {
    enviando.value = false
  }
}

// immediate: busca ao abrir a tela; refaz a busca se o id da URL mudar
watch(() => props.id, carregar, { immediate: true })
</script>

<template>
  <section class="pagina-form">
    <RouterLink :to="`/tarefas/${id}`" class="voltar">← Voltar para a tarefa</RouterLink>

    <h1>Editar tarefa</h1>

    <p v-if="carregando">Carregando...</p>
    <p v-if="erro" role="alert">{{ erro }}</p>
    <p v-if="enviando">Salvando...</p>

    <div v-if="inicial" class="campo">
      <label for="id">Id (não pode ser alterado)</label>
      <input id="id" :value="id" type="text" readonly />
    </div>

    <FormularioTarefa v-if="inicial" :inicial="inicial" @enviar="salvar" />
  </section>
</template>

<style scoped>
.pagina-form {
  padding: 1.5rem;
  text-align: left;
}
.voltar {
  display: inline-block;
  margin-bottom: 1rem;
}
.campo {
  display: grid;
  gap: 0.25rem;
  max-width: 32rem;
  margin-bottom: 1rem;
}
input {
  padding: 0.4rem 0.5rem;
  font: inherit;
}
</style>