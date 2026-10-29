<script setup lang="ts"></script>

<template>
  <!-- RouterLink marca sozinho o link da página atual com a classe
       router-link-exact-active e aria-current="page". -->
  <nav class="visoes" aria-label="Visão das tarefas">
    <RouterLink to="/">Lista</RouterLink>
    <RouterLink to="/quadro">Quadro</RouterLink>
  </nav>
</template>

<style scoped>
.visoes {
  display: inline-flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
}
.visoes a {
  padding: 0.4rem 1rem;
  color: var(--text-h);
  text-decoration: none;
}
.visoes a.router-link-exact-active {
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 600;
}
</style>
