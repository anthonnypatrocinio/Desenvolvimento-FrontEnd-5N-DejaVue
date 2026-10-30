<script setup lang="ts">
// Aviso de erro com botão para tentar de novo. Quem usa decide o que "tentar de novo" faz.
defineProps<{ mensagem: string }>()
const emit = defineEmits<{ 'tentar-novamente': [] }>()
</script>

<template>
  <!-- role="alert": o leitor de tela lê o aviso na hora, sem a pessoa precisar procurar -->
  <div class="estado-erro" role="alert">
    <p>{{ mensagem }}</p>
    <button type="button" class="botao" @click="emit('tentar-novamente')">Tentar novamente</button>
  </div>
</template>

<style scoped>
.estado-erro {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem 1.2rem;
}
.estado-erro p {
  margin: 0;
}
</style>
