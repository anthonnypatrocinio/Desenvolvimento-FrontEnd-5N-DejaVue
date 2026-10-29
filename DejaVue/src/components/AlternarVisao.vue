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
  gap: 0.4rem;
  margin: 0.4rem 0 0.6rem;
}
.visoes a {
  padding: 0.05rem 1rem;
  border: 2px dashed transparent;
  border-radius: var(--rabisco);
  font: 700 1.6rem/1.3 var(--f-titulo);
  text-decoration: none;
  color: var(--suave);
  transition:
    transform 0.2s cubic-bezier(0.3, 1.6, 0.5, 1),
    color 0.2s;
}
.visoes a:hover {
  background: none;
  color: var(--tinta);
  transform: rotate(-2deg) scale(1.06);
}
/* a visão atual fica marcada com marca-texto e circulada */
.visoes a.router-link-exact-active {
  color: var(--tinta);
  background: linear-gradient(var(--mt-amarelo), var(--mt-amarelo)) 0 80% / 100% 55% no-repeat;
  border-color: var(--tinta);
  transform: rotate(-1.5deg);
}
</style>
