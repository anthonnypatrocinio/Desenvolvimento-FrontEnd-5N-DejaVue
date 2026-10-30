<script setup lang="ts">
// Aviso de "carregando". Aparece enquanto a API não responde.
defineProps<{ mensagem?: string }>()
</script>

<template>
  <!-- role="status": o leitor de tela avisa a mudança, sem interromper quem está lendo -->
  <div class="carregando" role="status" aria-live="polite">
    <span class="lapis" aria-hidden="true">✎</span>
    <p>
      {{ mensagem ?? 'Folheando o caderno' }}<span class="pontos" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
    </p>
  </div>
</template>

<style scoped>
.carregando {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem 0.4rem;
  font-family: var(--f-mao);
  font-size: 1.4rem;
  color: var(--tinta);
}
.carregando p {
  margin: 0;
}
.lapis {
  display: inline-block;
  font-size: 1.8rem;
  transform-origin: 20% 90%;
  animation: escrever 1.1s ease-in-out infinite;
}
.pontos i {
  font-style: normal;
  animation: piscar 1.2s infinite;
}
.pontos i:nth-child(2) {
  animation-delay: 0.2s;
}
.pontos i:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes escrever {
  0%,
  100% {
    transform: rotate(-12deg) translateX(0);
  }
  50% {
    transform: rotate(6deg) translateX(8px);
  }
}
@keyframes piscar {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 1;
  }
}
</style>
