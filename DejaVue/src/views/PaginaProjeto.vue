''<script setup lang="ts">
import { ref, watch } from 'vue'
import { buscarProjetoComTarefas, type ProjetoComTarefas } from '../api'
import TarefaCard from '../components/TarefaCard.vue'
import { useMudarStatus } from '../composables/useMudarStatus'

// O roteador (issue #10) entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>()
const projeto = ref<ProjetoComTarefas | null>(null)
const carregando = ref(true)
const erro = ref('')
const { erroStatus, mudarStatus } = useMudarStatus()

// A data vem como texto "AAAA-MM-DD". Trocar a ordem evita o fuso horário do Date.
const formatarData = (data: string) => data.split('-').reverse().join('/')

async function carregar(id: string) {
  carregando.value = true
  erro.value = ''
  projeto.value = null
  try {
    // _embed=tarefas devolve o projeto já com as tarefas dele
    const encontrado = await buscarProjetoComTarefas(id)
    // Se o id da URL mudou enquanto esperava, descarta a resposta antiga
    if (id !== props.id) return
    projeto.value = encontrado
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

// immediate: busca ao abrir a tela; refaz a busca se o id da URL mudar
watch(() => props.id, carregar, { immediate: true })
</script>

<template>
  <section class="pagina-projeto">
    <RouterLink to="/projetos" class="voltar">← Voltar para os projetos</RouterLink>

    <p v-if="carregando">Carregando...</p>
    <p v-else-if="erro" role="alert">{{ erro }}</p>
    <template v-else-if="projeto">
      <h1>{{ projeto.nome }}</h1>
      <RouterLink :to="`/projetos/${projeto.id}/editar`">Editar projeto</RouterLink>
      <p>{{ projeto.descricao }}</p>
      <p>
        Disciplina: {{ projeto.disciplina }} · Criado em
        {{ formatarData(projeto.criadoEm) }}
      </p>

      <h2>Tarefas ({{ projeto.tarefas.length }})</h2>
      <RouterLink :to="{ path: '/tarefas/nova', query: { projetoId: projeto.id } }">  Nova tarefa </RouterLink>
      <p v-if="erroStatus" role="alert">{{ erroStatus }}</p>
      <p v-if="projeto.tarefas.length === 0">Este projeto ainda não tem tarefas.</p>
      <div v-else class="lista">
        <TarefaCard
          v-for="t in projeto.tarefas"
          :key="t.id"
          :tarefa="t"
          @mudar-status="(id, novo) => mudarStatus(projeto!.tarefas, id, novo)"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.pagina-projeto {
  padding: 1.5rem;
  text-align: left;
}
.voltar {
  display: inline-block;
  margin-bottom: 1rem;
}
.lista {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
