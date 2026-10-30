<script setup lang="ts">
// Aviso de "não tem nada aqui". O slot recebe o botão ou link com o próximo passo.
defineProps<{ mensagem: string }>()
</script>

<template>
  <div class="estado-vazio">
    <p class="mensagem">{{ mensagem }}</p>
    <!-- slot: quem usa coloca aqui a ação (ex.: "Criar a primeira tarefa") -->
    <slot />
  </div>
</template>

<style scoped>
.estado-vazio {
  display: grid;
  justify-items: start;
  gap: 0.9rem;
  margin: 1rem 0;
  padding: 1.6rem 1.4rem;
  border: 2.5px dashed var(--suave);
  border-radius: var(--rabisco);
  background: color-mix(in srgb, var(--papel) 70%, transparent);
  color: var(--lapis);
  transform: rotate(-0.4deg);
}
.mensagem {
  margin: 0;
  font-family: var(--f-titulo);
  font-size: 1.9rem;
  line-height: 1.1;
}
</style>
