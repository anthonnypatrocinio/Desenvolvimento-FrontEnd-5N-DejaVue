<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { atualizarProjeto, buscarProjeto } from '../api'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import FormularioProjeto, { type DadosProjeto } from '../components/FormularioProjeto.vue'
import { useCarregar } from '../composables/useCarregar'

const props = defineProps<{ id: string }>()
const router = useRouter()

const { dados: projeto, carregando, erro } = useCarregar(() => buscarProjeto(props.id), () => props.id)

// o formulário só edita estes 3 campos
const inicial = computed<DadosProjeto | null>(() => {
  if (!projeto.value) return null
  const { nome, descricao, disciplina } = projeto.value
  return { nome, descricao, disciplina }
})

const erroSalvar = ref('')
const enviando = ref(false)

async function salvar(dados: DadosProjeto) {
  if (enviando.value) return
  enviando.value = true
  erroSalvar.value = ''
  try {
    // PATCH só com os 3 campos: o criadoEm (e o id) continuam como estavam
    await atualizarProjeto(props.id, dados)
    await router.push(`/projetos/${props.id}`)
  } catch {
    erroSalvar.value = 'Não foi possível salvar as alterações. O json-server está rodando?'
  } finally {
    enviando.value = false
  }
}
</script>
<template>
 <section class="tela-projeto">
 <RouterLink :to="`/projetos/${id}`" class="voltar">← Voltar para o projeto</RouterLink>
 <h1>Editar projeto</h1>
 <EstadoCarregando v-if="carregando" />
 <p v-else-if="erro" role="alert">Não foi possível carregar o projeto.</p>
 <template v-else-if="inicial">
 <FormularioProjeto :inicial="inicial" :enviando="enviando" @enviar="salvar" />
 <p v-if="erroSalvar" role="alert">{{ erroSalvar }}</p>
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
