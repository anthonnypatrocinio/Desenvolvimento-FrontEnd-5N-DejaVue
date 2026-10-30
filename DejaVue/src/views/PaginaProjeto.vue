<script setup lang="ts">
import { computed } from 'vue'
import { buscarProjetoComTarefas } from '../api.ts'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import EstadoErro from '../components/EstadoErro.vue'
import EstadoNaoEncontrado from '../components/EstadoNaoEncontrado.vue'
import EstadoVazio from '../components/EstadoVazio.vue'
import TarefaCard from '../components/TarefaCard.vue'
import { useCarregar } from '../composables/useCarregar.ts'
import { ehNaoEncontrado, mensagemDeErro } from '../erros.ts'
import { useMudarStatus } from '../composables/useMudarStatus.ts'

// O roteador entrega o :id da URL como prop (props: true)
const props = defineProps<{ id: string }>()
// _embed=tarefas devolve o projeto já com as tarefas dele; refaz a busca se o :id mudar
const { dados: projeto, carregando, erro, recarregar } = useCarregar(() => buscarProjetoComTarefas(props.id), () => props.id)
const { erroStatus, mudarStatus } = useMudarStatus()

// Progresso = tarefas concluídas / total (recalcula sozinho quando um status muda)
const concluidas = computed(() => projeto.value?.tarefas.filter((t) => t.status === 'concluida').length ?? 0)
const percentual = computed(() => {
  const total = projeto.value?.tarefas.length ?? 0
  return total === 0 ? 0 : Math.round((concluidas.value / total) * 100)
})

// A data vem como texto "AAAA-MM-DD". Trocar a ordem evita o fuso horário do Date.
const formatarData = (data: string) => data.split('-').reverse().join('/')
</script>

<template>
  <section class="pagina-projeto">
    <RouterLink to="/projetos" class="voltar">← Voltar para os projetos</RouterLink>

    <EstadoCarregando v-if="carregando" />
    <EstadoNaoEncontrado
      v-else-if="ehNaoEncontrado(erro)"
      mensagem="Projeto não encontrado."
      voltar-para="/projetos"
      voltar-texto="Voltar para os projetos"
    />
    <EstadoErro v-else-if="erro" :mensagem="mensagemDeErro(erro, 'carregar o projeto')" @tentar-novamente="recarregar" />
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
      <EstadoVazio v-if="projeto.tarefas.length === 0" mensagem="Este projeto ainda não tem tarefas.">
        <RouterLink :to="{ path: '/tarefas/nova', query: { projetoId: projeto.id } }" class="botao botao--destaque">
          Nova tarefa neste projeto
        </RouterLink>
      </EstadoVazio>
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
