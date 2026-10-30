<script setup lang="ts">
import { computed } from 'vue'
import { listarProjetos } from '../api'
import EstadoCarregando from '../components/EstadoCarregando.vue'
import { useCarregar } from '../composables/useCarregar'

const { dados, carregando, erro } = useCarregar(listarProjetos)
const projetos = computed(() => dados.value ?? [])

// cores das capas dos cadernos (a ordem se repete se houver mais projetos)
const capas = ['#c0504d', '#3b78b5', '#4a9a62', '#8a5aa8', '#d58a2a']
</script>

<template>
  <section>
    <header class="pagina-topo">
      <div>
        <span class="sobre">Disciplinas e trabalhos</span>
        <h1>Projetos</h1>
      </div>
      <RouterLink to="/projetos/novo" class="botao botao--destaque">+ Novo projeto</RouterLink>
    </header>

    <EstadoCarregando v-if="carregando" mensagem="Buscando os cadernos" />
    <p v-else-if="erro" role="alert">Não foi possível carregar os projetos.</p>

    <ul v-else-if="projetos.length > 0" class="estante">
      <li v-for="(projeto, i) in projetos" :key="projeto.id">
        <!-- cada projeto é um caderno: capa colorida, elástico e etiqueta -->
        <RouterLink :to="`/projetos/${projeto.id}`" class="capa" :style="{ '--capa': capas[i % capas.length] }">
          <span class="elastico" aria-hidden="true"></span>
          <span class="etiqueta">
            <strong class="nome">{{ projeto.nome }}</strong>
            <span class="disciplina">{{ projeto.disciplina }}</span>
          </span>
          <span class="descricao">{{ projeto.descricao }}</span>
          <span class="abrir" aria-hidden="true">abrir →</span>
        </RouterLink>
      </li>
    </ul>

    <p v-else>Nenhum projeto encontrado.</p>
  </section>
</template>

<style scoped>
.estante {
  display: grid;
  gap: 2.4rem 2rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}
.capa {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  height: 100%;
  min-height: 15rem;
  padding: 1.4rem 2.6rem 1.2rem 2rem;
  border-radius: 6px 16px 16px 6px;
  background:
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.18), transparent 55%),
    var(--capa);
  /* lombada mais escura à esquerda */
  box-shadow:
    inset 14px 0 0 rgba(0, 0, 0, 0.22),
    inset 15px 0 0 rgba(255, 255, 255, 0.12),
    0 14px 18px -10px rgba(0, 0, 0, 0.55);
  color: #fff;
  text-decoration: none;
  transform-origin: left center;
  transition:
    transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1),
    box-shadow 0.35s;
}
.capa:hover {
  background-color: transparent;
  transform: perspective(900px) rotateY(-16deg) translateY(-4px);
  box-shadow:
    inset 14px 0 0 rgba(0, 0, 0, 0.22),
    0 24px 26px -12px rgba(0, 0, 0, 0.6);
}
.elastico {
  position: absolute;
  inset: 0 1.2rem 0 auto;
  width: 0.7rem;
  background: rgba(0, 0, 0, 0.3);
}
.etiqueta {
  display: grid;
  gap: 0.2rem;
  padding: 0.7rem 0.9rem;
  border-radius: 3px;
  background:
    repeating-linear-gradient(to bottom, transparent 0, transparent 1.55rem, var(--pauta) 1.55rem, var(--pauta) calc(1.55rem + 1px)),
    var(--papel);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  transform: rotate(-1.2deg);
}
.nome {
  font: 700 2rem/1.05 var(--f-titulo);
  color: var(--tinta);
}
.disciplina {
  font: 0.78rem var(--f-maquina);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--suave);
}
.descricao {
  flex: 1;
  font-size: 1.15rem;
}
.abrir {
  align-self: flex-end;
  font: 700 1.6rem var(--f-titulo);
  transition: transform 0.2s;
}
.capa:hover .abrir {
  transform: translateX(6px);
}
</style>
