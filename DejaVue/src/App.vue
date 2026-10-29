<script setup lang="ts">
import CabecalhoMenu from './components/CabecalhoMenu.vue'
import FundoMesa from './components/FundoMesa.vue'
</script>

<template>
  <FundoMesa />
  <div class="mesa">
    <CabecalhoMenu />
    <div class="caderno">
      <div class="espiral" aria-hidden="true"></div>
      <main class="pagina">
        <!-- cada tela entra como uma folha virando (transição "folha", em style.css) -->
        <RouterView v-slot="{ Component }">
          <Transition name="folha" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>
