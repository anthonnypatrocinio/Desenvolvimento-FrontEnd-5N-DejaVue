import { ref, watch, type Ref } from 'vue'

// Busca dados e controla os estados da tela: carregando, erro e dados.
// - `buscar`: a função que chama a API (ex.: listarTarefas).
// - `observar`: (opcional) o que, ao mudar, manda buscar de novo (ex.: o :id da URL).
export function useCarregar<T>(buscar: () => Promise<T>, observar?: () => unknown) {
  const dados = ref<T | null>(null) as Ref<T | null>
  const carregando = ref(true)
  const erro = ref<unknown>(null)

  // Cada busca ganha um número. Se outra começar enquanto esta espera,
  // a resposta antiga é descartada (evita mostrar dados da tela anterior).
  let rodada = 0

  async function recarregar() {
    const minha = ++rodada
    carregando.value = true
    erro.value = null
    try {
      const resultado = await buscar()
      if (minha !== rodada) return
      dados.value = resultado
    } catch (e) {
      if (minha !== rodada) return
      dados.value = null
      erro.value = e
      console.error(e) // o texto técnico fica no console; a tela mostra outra mensagem
    } finally {
      if (minha === rodada) carregando.value = false
    }
  }

  // immediate: busca ao abrir a tela. Sem `observar`, só roda essa primeira vez.
  watch(observar ?? (() => undefined), recarregar, { immediate: true })

  return { dados, carregando, erro, recarregar }
}
