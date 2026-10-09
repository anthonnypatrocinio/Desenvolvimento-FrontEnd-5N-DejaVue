import type { Projeto, Tarefa } from './tipos'

const API = 'http://localhost:3000'
export type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] }

async function buscar<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${API}${caminho}`)
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
  return resposta.json() as Promise<T>
}

export const listarTarefas = () => buscar<Tarefa[]>('/tarefas')
export const buscarTarefa = (id: string) => buscar<Tarefa>(`/tarefas/${id}`)
export const listarProjetos = () => buscar<Projeto[]>('/projetos')
export const buscarProjeto = (id: string) => buscar<Projeto>(`/projetos/${id}`)
export const buscarProjetoComTarefas = (id: string) =>
  buscar<ProjetoComTarefas>(`/projetos/${id}?_embed=tarefas`)