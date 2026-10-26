import { createRouter, createWebHistory } from 'vue-router'
import ListaTarefas from './views/ListaTarefas.vue'
import Quadro from './views/Quadro.vue'
import NovaTarefa from './views/NovaTarefa.vue'
import DetalheTarefa from './views/DetalheTarefa.vue'
import EditarTarefa from './views/EditarTarefa.vue'
import ListaProjetos from './views/ListaProjetos.vue'
import NovoProjeto from './views/NovoProjeto.vue'
import PaginaProjeto from './views/PaginaProjeto.vue'
import EditarProjeto from './views/EditarProjeto.vue'
import NaoEncontrado from './views/NaoEncontrado.vue'

// Regra de ouro: rotas FIXAS antes das rotas com parâmetro (:id),
// e a rota "pega-tudo" (404) por último.
export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ListaTarefas },
    { path: '/quadro', component: Quadro },
    { path: '/tarefas/nova', component: NovaTarefa }, // fixa: antes de /tarefas/:id
    { path: '/tarefas/:id', component: DetalheTarefa, props: true },
    { path: '/tarefas/:id/editar', component: EditarTarefa, props: true },
    { path: '/projetos', component: ListaProjetos },
    { path: '/projetos/novo', component: NovoProjeto }, // fixa: antes de /projetos/:id
    { path: '/projetos/:id', component: PaginaProjeto, props: true },
    { path: '/projetos/:id/editar', component: EditarProjeto, props: true },
    { path: '/:pathMatch(.*)*', component: NaoEncontrado }, // 404: sempre por último
  ],
})