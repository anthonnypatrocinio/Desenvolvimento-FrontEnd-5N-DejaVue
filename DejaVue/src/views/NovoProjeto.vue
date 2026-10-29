<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { criarProjeto } from '../api'
import FormularioProjeto, { type DadosProjeto } from '../components/FormularioProjeto.vue'
const router = useRouter()
const enviando = ref(false)
const erro = ref('')
// Data de hoje no fuso do usuário, no formato AAAA-MM-DD ('sv-SE' usa esse formato).
// toISOString() usaria UTC e, à noite no Brasil, já devolveria o dia seguinte.
const hoje = () => new Date().toLocaleDateString('sv-SE')
async function salvar(dados: DadosProjeto) {
 if (enviando.value) return
 enviando.value = true
 erro.value = ''
 try {
 await criarProjeto({ ...dados, criadoEm: hoje() })
 await router.push('/projetos')
 } catch {
 erro.value = 'Não foi possível salvar o projeto. O json-server está rodando?'
 } finally {
 enviando.value = false
 }
}
</script>
<template>
 <section class="tela-projeto">
 <RouterLink to="/projetos" class="voltar">← Voltar para os projetos</RouterLink>
 <h1>Novo projeto</h1>
 <FormularioProjeto :enviando="enviando" @enviar="salvar" />
 <p v-if="erro" role="alert">{{ erro }}</p>
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
