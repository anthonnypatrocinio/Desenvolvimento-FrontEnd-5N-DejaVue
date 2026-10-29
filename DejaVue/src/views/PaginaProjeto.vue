''<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { buscarProjetoComTarefas, type ProjetoComTarefas } from '../api'
import TarefaCard from '../components/TarefaCard.vue'
import { useMudarStatus } from '../composables/useMudarStatus'

// O roteador (issue #10) entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>()
const projeto = ref<ProjetoComTarefas | null>(null)
const carregando = ref(true)
const erro = ref('')
const { erroStatus, mudarStatus } = useMudarStatus()

// Progresso = tarefas concluídas / total (recalcula sozinho quando um status muda)
const concluidas = computed(() => projeto.value?.tarefas.filter((t) => t.status === 'concluida').length ?? 0)
const percentual = computed(() => {
  const total = projeto.value?.tarefas.length ?? 0
  return total === 0 ? 0 : Math.round((concluidas.value / total) * 100)
})

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
      <header class="pagina-topo">
        <div>
          <span class="sobre">{{ projeto.disciplina }}</span>
          <h1>{{ projeto.nome }}</h1>
        </div>
        <RouterLink :to="`/projetos/${projeto.id}/editar`" class="botao botao--suave">Editar projeto</RouterLink>
      </header>

      <p class="descricao">{{ projeto.descricao }}</p>
      <p class="meta">Criado em {{ formatarData(projeto.criadoEm) }}</p>

      <div class="progresso" role="group" aria-label="Progresso do projeto">
        <div class="trilho" role="progressbar" :aria-valuenow="percentual" aria-valuemin="0" aria-valuemax="100">
          <div class="marca" :style="{ width: percentual + '%' }"></div>
        </div>
        <p><strong>{{ percentual }}%</strong> feito · {{ concluidas }} de {{ projeto.tarefas.length }} tarefas</p>
      </div>

      <div class="pagina-topo secao">
        <h2>Tarefas ({{ projeto.tarefas.length }})</h2>
        <RouterLink :to="{ path: '/tarefas/nova', query: { projetoId: projeto.id } }" class="botao botao--destaque">
          + Nova tarefa
        </RouterLink>
      </div>

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
.descricao {
  max-width: 44rem;
  font-size: 1.3rem;
}
.meta {
  font: 0.85rem var(--f-maquina);
  letter-spacing: 0.06em;
  color: var(--suave);
}
.progresso {
  display: grid;
  gap: 0.3rem;
  max-width: 30rem;
  margin: 1.2rem 0 2.2rem;
  font-size: 1.25rem;
}
/* barra de progresso = trecho passado com marca-texto */
.trilho {
  height: 1.5rem;
  border: 2.5px solid var(--tinta);
  border-radius: var(--rabisco);
  background: rgba(255, 255, 255, 0.5);
  overflow: hidden;
}
.marca {
  height: 100%;
  background: repeating-linear-gradient(-45deg, var(--mt-verde) 0 8px, #9fe6b6 8px 16px);
  transition: width 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.secao {
  align-items: center;
  margin-bottom: 0.4rem;
}
</style>
