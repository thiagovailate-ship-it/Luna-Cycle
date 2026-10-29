import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Luna Cycle: erro inesperado na interface', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="error-shell">
        <div className="error-card" role="alert">
          <div className="eyebrow">Algo saiu do ritmo</div>
          <h1>Não foi possível mostrar esta tela</h1>
          <p>Seus registros continuam salvos neste navegador. Recarregue a página para tentar de novo. Se o problema continuar, exporte um backup assim que o app abrir.</p>
          <div className="row wrap">
            <button type="button" className="button button-primary" onClick={() => window.location.reload()}>Recarregar</button>
            <button type="button" className="button button-secondary" onClick={() => { window.location.hash = '#/app'; this.setState({ error: null }) }}>Voltar ao início</button>
          </div>
          <details>
            <summary>Detalhes técnicos</summary>
            <pre>{String(this.state.error?.message || this.state.error)}</pre>
          </details>
        </div>
      </div>
    )
  }
}
