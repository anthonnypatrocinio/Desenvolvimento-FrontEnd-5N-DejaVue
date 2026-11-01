try {
      await atualizarTarefa(id, { status: novo })
    } catch (e) {
      console.error(e)
      tarefa.status = anterior
      erroStatus.value = `${mensagemDeErro(e, 'salvar o novo status')} O status voltou ao que era.`
    }