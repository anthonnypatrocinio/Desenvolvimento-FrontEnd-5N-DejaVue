<script setup lang="ts">
// "Esta página do caderno não existe": usado quando a API responde 404 para um id.
defineProps<{ mensagem: string; voltarPara: string; voltarTexto: string }>()
</script>

<template>
  <div class="nao-encontrado-item" role="alert">
    <p class="titulo">{{ mensagem }}</p>
    <p>O endereço pode estar errado, ou o item foi excluído.</p>
    <RouterLink :to="voltarPara" class="botao">{{ voltarTexto }}</RouterLink>
  </div>
</template>

<style scoped>
.nao-encontrado-item {
  display: grid;
  justify-items: start;
  gap: 0.5rem;
}
.nao-encontrado-item p {
  margin: 0;
}
.titulo {
  font-family: var(--f-titulo);
  font-size: 1.8rem;
  line-height: 1.1;
}
</style>
