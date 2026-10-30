<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { buscarTarefa, atualizarTarefa } from '../api.ts'
import type { NovaTarefa } from '../tipos.ts'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import EstadoErro from '../components/EstadoErro.vue'
import EstadoNaoEncontrado from '../components/EstadoNaoEncontrado.vue'
import FormularioTarefa from '../components/FormularioTarefa.vue'
import { useCarregar } from '../composables/useCarregar'
import { ehNaoEncontrado, mensagemDeErro } from '../erros'

// O roteador entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>()
const router = useRouter()

const { dados: tarefa, carregando, erro, recarregar } = useCarregar(() => buscarTarefa(props.id), () => props.id)

// o formulário trabalha com os campos sem o id
const inicial = computed<NovaTarefa | null>(() => {
  if (!tarefa.value) return null
  const { id: _id, ...campos } = tarefa.value
  return campos
})

const enviando = ref(false)
const erroSalvar = ref('')

async function salvar(dados: NovaTarefa) {
  // evita enviar duas vezes se o botão for clicado de novo
  if (enviando.value) return
  enviando.value = true
  erroSalvar.value = ''
  try {
    // os dados do formulário não têm id, então o id da tarefa não muda
    await atualizarTarefa(props.id, dados)
    // salvou: volta para o detalhe da tarefa
    await router.push(`/tarefas/${props.id}`)
  } catch {
    erroSalvar.value = 'Não foi possível salvar as alterações. Tente de novo.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="pagina-form">
    <RouterLink :to="`/tarefas/${id}`" class="voltar">← Voltar para a tarefa</RouterLink>

    <h1>Editar tarefa</h1>

    <EstadoCarregando v-if="carregando" />
    <EstadoNaoEncontrado
      v-else-if="ehNaoEncontrado(erro)"
      mensagem="Tarefa não encontrada."
      voltar-para="/"
      voltar-texto="Voltar para as tarefas"
    />
    <EstadoErro v-else-if="erro" :mensagem="mensagemDeErro(erro, 'carregar a tarefa')" @tentar-novamente="recarregar" />
    <template v-else-if="inicial">
      <p v-if="erroSalvar" role="alert">{{ erroSalvar }}</p>
      <p v-if="enviando">Salvando...</p>

      <div class="campo">
        <label for="id">Id (não pode ser alterado)</label>
        <input id="id" :value="id" type="text" readonly />
      </div>

      <FormularioTarefa :inicial="inicial" @enviar="salvar" />
    </template>
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
