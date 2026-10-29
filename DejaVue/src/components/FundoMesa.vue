<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

// A mesa reage ao mouse: a luz do abajur segue o ponteiro e os rabiscos de giz
// deslizam em profundidades diferentes (parallax). Só roda com mouse e sem
// "reduzir movimento"; no celular a mesa fica parada.
let quadro = 0
let aoMover: ((e: PointerEvent) => void) | null = null

onMounted(() => {
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const mouse = window.matchMedia('(pointer: fine)').matches
  if (reduzir || !mouse) return

  const raiz = document.documentElement
  let x = 0.5
  let y = 0.3
  aoMover = (e: PointerEvent) => {
    x = e.clientX / window.innerWidth
    y = e.clientY / window.innerHeight
    if (quadro) return
    // no máximo uma atualização por quadro de tela
    quadro = requestAnimationFrame(() => {
      raiz.style.setProperty('--mx', x.toFixed(3))
      raiz.style.setProperty('--my', y.toFixed(3))
      quadro = 0
    })
  }
  window.addEventListener('pointermove', aoMover, { passive: true })
})

onBeforeUnmount(() => {
  if (aoMover) window.removeEventListener('pointermove', aoMover)
  cancelAnimationFrame(quadro)
})
</script>

<template>
  <div class="mesa-fundo" aria-hidden="true">
    <div class="tapete"></div>

    <svg class="rabiscos" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <g class="camada" style="--prof: 14px">
        <text x="70" y="180" font-size="68" transform="rotate(-8 70 180)">E = mc²</text>
        <text x="1290" y="120" font-size="58" transform="rotate(6 1290 120)">∫ f(x) dx</text>
        <text x="50" y="840" font-size="50" transform="rotate(-4 50 840)">π ≈ 3,14159</text>
        <g transform="translate(1470 700)">
          <ellipse rx="74" ry="26" />
          <ellipse rx="74" ry="26" transform="rotate(60)" />
          <ellipse rx="74" ry="26" transform="rotate(120)" />
          <circle r="7" />
        </g>
      </g>
      <g class="camada" style="--prof: 28px">
        <g transform="translate(150 470)">
          <path d="M-26 -10 a30 30 0 1 1 52 0 c-8 10 -10 18 -10 28 h-32 c0 -10 -2 -18 -10 -28 z" />
          <path d="M-16 34 h32 M-12 44 h24 M-6 54 h12" />
          <path d="M-60 -50 l-14 -10 M0 -78 v-18 M60 -50 l14 -10" />
        </g>
        <g transform="translate(1390 430)">
          <path d="M0 0 V-130 M0 0 H170 M-6 -120 L0 -132 L6 -120 M160 -6 L172 0 L160 6" />
          <path d="M8 -20 C50 -110, 90 -10, 160 -100" />
        </g>
        <text x="1230" y="870" font-size="54" transform="rotate(-6 1230 870)">prova sexta!!</text>
        <text x="70" y="640" font-size="42" transform="rotate(5 70 640)">a² + b² = c²</text>
      </g>
      <g class="camada" style="--prof: 46px">
        <g transform="translate(790 840)">
          <circle r="30" />
          <ellipse rx="58" ry="12" transform="rotate(-18)" />
        </g>
        <text x="990" y="80" font-size="46" transform="rotate(-3 990 80)">git commit -m "estudei"</text>
        <text x="500" y="870" font-size="86" transform="rotate(-8 500 870)">Σ</text>
        <path d="M300 60 l8 20 l22 2 l-17 14 l6 22 l-19 -12 l-19 12 l6 -22 l-17 -14 l22 -2 z" />
        <path d="M1520 300 l6 14 l15 1 l-12 10 l4 15 l-13 -8 l-13 8 l4 -15 l-12 -10 l15 -1 z" />
      </g>
    </svg>

    <!-- luz do abajur: fica por cima de tudo e segue o ponteiro -->
    <div class="luz"></div>
  </div>
</template>

<style scoped>
/* tapete de cortar (grade) */
.tapete {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(var(--mesa-linha) 1px, transparent 1px) 0 0 / 28px 28px,
    linear-gradient(90deg, var(--mesa-linha) 1px, transparent 1px) 0 0 / 28px 28px,
    radial-gradient(90rem 50rem at 50% 0%, rgba(255, 255, 255, 0.07), transparent 70%);
  z-index: 0;
}
.rabiscos {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  fill: rgba(255, 255, 255, 0.2);
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.rabiscos :is(ellipse, circle, path) {
  fill: none;
}
.rabiscos text {
  font-family: var(--f-titulo);
  font-weight: 600;
  stroke: none;
}
.camada {
  transform: translate(calc((var(--mx) - 0.5) * var(--prof) * -1), calc((var(--my) - 0.5) * var(--prof) * -1));
  transition: transform 0.25s ease-out;
}
.luz {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background:
    radial-gradient(circle 460px at calc(var(--mx) * 100%) calc(var(--my) * 100%), rgba(255, 238, 170, 0.28), transparent 72%),
    radial-gradient(circle 1100px at calc(var(--mx) * 100%) calc(var(--my) * 100%), transparent 0%, rgba(6, 14, 28, 0.2) 100%);
}
</style>
