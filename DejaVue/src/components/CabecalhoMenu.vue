<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// "Tarefas" fica destacada em / e em /tarefas/:id; "Projetos" em /projetos e /projetos/:id
const emTarefas = computed(() => route.path === '/' || route.path.startsWith('/tarefas'))
const emProjetos = computed(() => route.path.startsWith('/projetos'))
const emQuadro = computed(() => route.path.startsWith('/quadro'))
</script>

<template>
  <header class="topo-mesa">
    <RouterLink to="/" class="marca" aria-label="DejaVue, ir para o início">
      <svg class="visto" viewBox="0 0 48 40" aria-hidden="true">
        <path d="M4 18 C10 22, 14 30, 18 36 C24 22, 34 10, 45 3" />
      </svg>
      <span class="nome">Deja<b>Vue</b></span>
      <span class="lema">caderno de tarefas acadêmicas</span>
    </RouterLink>

    <!-- abas coloridas, como divisórias de caderno -->
    <nav class="abas" aria-label="Navegação principal">
      <RouterLink to="/" class="aba aba--amarela" :class="{ ativo: emTarefas }">Tarefas</RouterLink>
      <RouterLink to="/quadro" class="aba aba--rosa" :class="{ ativo: emQuadro }">Quadro</RouterLink>
      <RouterLink to="/projetos" class="aba aba--azul" :class="{ ativo: emProjetos }">Projetos</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.topo-mesa {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  padding: 1.6rem 0.5rem 0;
  position: relative;
  z-index: 1;
}
.marca {
  display: inline-flex;
  align-items: baseline;
  gap: 0.6rem;
  padding-bottom: 0.7rem;
  text-decoration: none;
  color: #fff;
}
.marca:hover {
  background: none;
}
.visto {
  align-self: center;
  width: 2.6rem;
  height: 2.2rem;
  fill: none;
  stroke: var(--mt-verde);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 90;
  stroke-dashoffset: 0;
}
/* o visto é "desenhado" de novo ao passar o mouse */
.marca:hover .visto {
  animation: desenhar 0.6s ease-out;
}
@keyframes desenhar {
  from {
    stroke-dashoffset: 90;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.nome {
  font: 700 2.7rem/1 var(--f-titulo);
  color: #fff;
}
.nome b {
  padding: 0 0.25rem;
  color: var(--tinta);
  background: var(--mt-amarelo);
  transform: rotate(-2deg);
  display: inline-block;
}
.lema {
  font: 0.75rem var(--f-maquina);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

.abas {
  display: flex;
  align-items: flex-end;
  gap: 0.3rem;
  margin-right: 1rem;
}
.aba {
  --cor: var(--mt-amarelo);
  padding: 0.35rem 1.1rem 0.5rem;
  border-radius: 12px 12px 0 0;
  background: var(--cor);
  color: var(--lapis);
  font: 1.25rem/1.2 var(--f-mao);
  text-decoration: none;
  box-shadow: inset 0 -6px 8px -6px rgba(0, 0, 0, 0.25);
  transform: translateY(8px) rotate(-0.6deg);
  transition:
    transform 0.2s cubic-bezier(0.3, 1.6, 0.5, 1),
    padding 0.2s;
}
.aba--rosa {
  --cor: var(--mt-rosa);
}
.aba--azul {
  --cor: var(--mt-azul);
}
.aba:hover {
  background: var(--cor);
  transform: translateY(2px) rotate(0.8deg);
}
.aba.ativo {
  padding-top: 0.6rem;
  padding-bottom: 0.85rem;
  transform: translateY(6px);
  box-shadow: none;
  font-weight: 700;
  color: var(--tinta);
}
@media (max-width: 720px) {
  .lema {
    display: none;
  }
  .nome {
    font-size: 2.2rem;
  }
  .aba {
    padding: 0.3rem 0.7rem 0.45rem;
    font-size: 1.05rem;
  }
}
</style>
