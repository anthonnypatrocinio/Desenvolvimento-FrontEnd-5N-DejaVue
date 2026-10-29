<template>
  <section class="nao-encontrado">
    <p class="numero" aria-hidden="true">404</p>
    <h1>Página não encontrada</h1>
    <p class="recado">Alguém arrancou esta página do caderno. O endereço que você abriu não existe.</p>
    <RouterLink to="/" class="botao botao--destaque">Voltar para as tarefas</RouterLink>
  </section>
</template>

<style scoped>
.nao-encontrado {
  display: grid;
  justify-items: start;
  gap: 1rem;
  padding-top: 1rem;
}
.numero {
  font: 8rem/0.9 var(--f-marca);
  color: var(--vermelho);
  opacity: 0.85;
  transform: rotate(-6deg);
  /* borda rasgada em cima e embaixo */
  clip-path: polygon(0 6%, 4% 0, 9% 7%, 15% 0, 22% 6%, 30% 0, 38% 7%, 47% 0, 55% 6%, 64% 0, 72% 7%, 81% 0, 90% 6%, 100% 0, 100% 100%, 0 100%);
}
.recado {
  font-size: 1.35rem;
}
</style>
