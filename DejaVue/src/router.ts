import { createRouter, createWebHistory } from 'vue-router'
import ListaTarefas from './views/ListaTarefas.vue'
import DetalheTarefa from './views/DetalheTarefa.vue'
import ListaProjetos from './views/ListaProjetos.vue'
import PaginaProjeto from './views/PaginaProjeto.vue'
import NaoEncontrado from './views/NaoEncontrado.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ListaTarefas },
    { path: '/tarefas/:id', component: DetalheTarefa, props: true },
    { path: '/projetos', component: ListaProjetos },
    { path: '/projetos/:id', component: PaginaProjeto, props: true },
    { path: '/:pathMatch(.*)*', component: NaoEncontrado },
  ],
})