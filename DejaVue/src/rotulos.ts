import type { Prioridade, Status } from './tipos'

export const rotuloStatus: Record<Status, string> = {
 'a-fazer': 'A fazer',
 'em-andamento': 'Em andamento',
 'em-revisao': 'Em revisão',
 concluida: 'Concluída',
}
export const rotuloPrioridade: Record<Prioridade, string> = {
 baixa: 'Baixa',
 media: 'Média',
 alta: 'Alta',
}

export const opcoesStatus = Object.keys(rotuloStatus) as Status[]
export const opcoesPrioridade = Object.keys(rotuloPrioridade) as Prioridade[]