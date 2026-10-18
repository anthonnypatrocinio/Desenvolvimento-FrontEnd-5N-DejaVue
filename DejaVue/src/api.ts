import type { NovaTarefa, Projeto, Tarefa } from './tipos'

const API = 'http://localhost:3000'
export type ProjetoComTarefas = Projeto & { tarefas: Tarefa[] }
export type NovoProjeto = Omit<Projeto, 'id'>

async function requisicao<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(`${API}${caminho}`, opcoes)
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
  return resposta.json() as Promise<T>
}

const buscar = <T>(caminho: string) => requisicao<T>(caminho)

const enviar = <T>(metodo: 'POST' | 'PATCH', caminho: string, corpo: unknown) =>
  requisicao<T>(caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  }
)

export const listarTarefas = () => buscar<Tarefa[]>('/tarefas')
export const buscarTarefa = (id: string) => buscar<Tarefa>(`/tarefas/${id}`)
export const listarProjetos = () => buscar<Projeto[]>('/projetos')
export const buscarProjeto = (id: string) => buscar<Projeto>(`/projetos/${id}`)
export const buscarProjetoComTarefas = (id: string) =>
  buscar<ProjetoComTarefas>(`/projetos/${id}?_embed=tarefas`)

export const criarTarefa = (dados: NovaTarefa) =>
 enviar<Tarefa>('POST', '/tarefas', dados)
export const atualizarTarefa = (id: string, dados: Partial<NovaTarefa>) =>
 enviar<Tarefa>('PATCH', `/tarefas/${id}`, dados)
export const criarProjeto = (dados: NovoProjeto) =>
 enviar<Projeto>('POST', '/projetos', dados)
export const atualizarProjeto = (id: string, dados: Partial<NovoProjeto>) =>
 enviar<Projeto>('PATCH', `/projetos/${id}`, dados)