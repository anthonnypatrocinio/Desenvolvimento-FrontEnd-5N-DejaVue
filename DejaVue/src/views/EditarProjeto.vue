<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { atualizarProjeto, buscarProjeto } from '../api'
import FormularioProjeto, { type DadosProjeto } from '../components/FormularioProjeto.vue'
const props = defineProps<{ id: string }>()
const router = useRouter()
const inicial = ref<DadosProjeto | null>(null)
const carregando = ref(true)
const erro = ref('')
const erroSalvar = ref('')
const enviando = ref(false)
async function carregar(id: string) {
 carregando.value = true
 erro.value = ''
 inicial.value = null
 try {
 const { nome, descricao, disciplina } = await buscarProjeto(id)
 if (id !== props.id) return
 inicial.value = { nome, descricao, disciplina }
 } catch (e) {
 if (id !== props.id) return
 erro.value =
 e instanceof Error && e.message === 'HTTP 404'
 ? 'Projeto não encontrado.'
 : 'Não foi possível carregar o projeto. O json-server está rodando?'
 } finally {
 if (id === props.id) carregando.value = false
 }
}
watch(() => props.id, carregar, { immediate: true })
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
 <p v-if="carregando">Carregando...</p>
 <p v-else-if="erro" role="alert">{{ erro }}</p>
 <template v-else-if="inicial">
 <FormularioProjeto :inicial="inicial" :enviando="enviando" @enviar="salvar" />
 <p v-if="erroSalvar" role="alert">{{ erroSalvar }}</p>
 </template>
 </section>
</template>
<style scoped>
.tela-projeto {
 padding: 1.5rem;
 text-align: left;
}
.voltar {
 display: inline-block;
 margin-bottom: 1rem;
}
</style>