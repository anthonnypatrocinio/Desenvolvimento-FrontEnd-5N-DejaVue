<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// "Tarefas" fica destacado em / e em /tarefas/:id; "Projetos" em /projetos e /projetos/:id
const emTarefas = computed(
  () => route.path === "/" || route.path.startsWith("/tarefas"),
);
const emProjetos = computed(() => route.path.startsWith("/projetos"));
</script>

<template>
  <header class="cabecalho">
    <RouterLink to="/" class="marca">DejaVue</RouterLink>

    <nav class="menu" aria-label="Navegação principal">
      <RouterLink to="/" :class="{ ativo: emTarefas }">Tarefas</RouterLink>
      <RouterLink to="/projetos" :class="{ ativo: emProjetos }"
        >Projetos</RouterLink
      >
    </nav>
  </header>
</template>

<style scoped>
.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.marca {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-h);
  text-decoration: none;
}

.menu {
  display: flex;
  gap: 0.5rem;
}

.menu a {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  color: var(--text-h);
  text-decoration: none;
}

.menu a:hover {
  background: var(--accent-bg);
}

.menu a.ativo {
  color: var(--accent);
  background: var(--accent-bg);
  font-weight: 600;
}
</style>
