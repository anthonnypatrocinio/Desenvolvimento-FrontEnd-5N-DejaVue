<script setup lang="ts">
import CabecalhoMenu from "./components/CabecalhoMenu.vue";
</script>

<template>
  <CabecalhoMenu />
  <main class="conteudo">
    <RouterView />
  </main>
</template>

<style scoped>
.conteudo {
  flex-grow: 1;
}
</style>
