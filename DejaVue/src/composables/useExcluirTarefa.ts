import { excluirTarefa } from '../api';
import type { Tarefa } from '../tipos';

export function useExcluirTarefa() {
  // Pede confirmação, apaga na API e, só depois que a API confirmou, 
  // tira a tarefa da lista que está na tela (se a tela passou uma). 
  // Devolve true se a tarefa foi excluída, false se a pessoa desistiu.
  async function excluir(tarefa: Tarefa, lista?: Tarefa[]): Promise<boolean> {
    // window.confirm para a página até a pessoa responder: OK = true, Cancelar = false
    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"? Não dá para desfazer.`)) {
      return false;
    }

    await excluirTarefa(tarefa.id);

    if (lista) {
      const posicao = lista.findIndex((t) => t.id === tarefa.id);
      if (posicao >= 0) {
        lista.splice(posicao, 1); // splice muda o array reativo: a tela atualiza
      }
    }

    return true;
  }

  return { excluir };
}