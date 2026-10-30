<script setup lang="ts">
import { computed } from 'vue'
import { listarTarefas } from '../api'
import AlternarVisao from '../components/AlternarVisao.vue'
import BarraFiltros from '../components/BarraFiltros.vue'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import EstadoErro from '../components/EstadoErro.vue'
import TarefaCard from '../components/TarefaCard.vue'
import { useCarregar } from '../composables/useCarregar'
import { mensagemDeErro } from '../erros'
import { useFiltros } from '../composables/useFiltros'
import { useMudarStatus } from '../composables/useMudarStatus'
import type { Status, Tarefa } from '../tipos'

// dados = as tarefas (ou null enquanto não chegaram), carregando e erro vêm do composable
const { dados: tarefas, carregando, erro, recarregar } = useCarregar(listarTarefas)
const { aplicarFiltros } = useFiltros()
const { erroStatus, mudarStatus } = useMudarStatus()

// Só as tarefas que passam pela busca e pelos filtros (a lista original não muda)
const visiveis = computed(() => aplicarFiltros(tarefas.value ?? []))
const total = computed(() => tarefas.value?.length ?? 0)

function mudar(id: Tarefa['id'], novo: Status) {
  if (tarefas.value) mudarStatus(tarefas.value, id, novo)
}
</script>

<template>
  <section>
    <header class="pagina-topo">
      <div>
        <span class="sobre">Visão geral</span>
        <h1>Tarefas</h1>
      </div>
      <RouterLink to="/tarefas/nova" class="botao botao--destaque">+ Nova tarefa</RouterLink>
    </header>

    <AlternarVisao />
    <BarraFiltros />

    <EstadoCarregando v-if="carregando" />
    <EstadoErro v-else-if="erro" :mensagem="mensagemDeErro(erro, 'carregar as tarefas')" @tentar-novamente="recarregar" />
    <template v-else>
      <p class="resumo" aria-live="polite">{{ visiveis.length }} de {{ total }} tarefas</p>
      <p v-if="erroStatus" role="alert">{{ erroStatus }}</p>

      <div class="lista">
        <TarefaCard v-for="t in visiveis" :key="t.id" :tarefa="t" @mudar-status="mudar" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.resumo {
  margin-bottom: 0.6rem;
  font: 0.85rem var(--f-maquina);
  letter-spacing: 0.06em;
  color: var(--suave);
}
</style>
