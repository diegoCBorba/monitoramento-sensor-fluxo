import { useState } from "react"
import { Metrics } from "./components/Metrics"
import { useFlowSocket } from "./hooks/useFlowSocket"
import { ExperimentResult } from "./components/ExperimentResult"
import { ExperimentControl } from "./components/ExperimentControl"
import type { ExperimentRow } from "./types/ExperimentRow"
import { ExperimentTable } from "./components/ExperimentTable"

function App() {
  const { liveData, startCollection, stopCollection } = useFlowSocket()
  const [result, setResult] = useState<any>(null)
  const [rows, setRows] = useState<ExperimentRow[]>([])

  function handleFinish(duration: number) {
    const res = stopCollection(duration)
    if (!res) return

    const entry: ExperimentRow = {
      totalIn: res.totalIn,
      totalOut: res.totalOut,
      avgDiff: res.avgDiff,
      timestamp: new Date(),
    }

    // evitar duplicados se o último registro for igual
    setRows((prev) => {
      const last = prev[prev.length - 1]
      if (
        last &&
        last.totalIn === entry.totalIn &&
        last.totalOut === entry.totalOut &&
        Math.abs((last.avgDiff || 0) - (entry.avgDiff || 0)) < 1e-9
      ) {
        console.log('handleFinish: duplicate entry ignored', entry)
        return prev
      }

      console.log('handleFinish: adding entry', entry)
      return [...prev, entry]
    })

    setResult(res)
  }

  function handleReset() {
    setResult(null)
  }

  if (!liveData) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
    }}>
      <h2>Conectando ao sistema hidráulico...</h2>
    </div>
  )

  return (
    <div className="app-root">
      <div className="stage">
        <div className="grid">
          <div className="card">
            <Metrics data={liveData} />
          </div>

          <h2 style={{ marginTop: 0 }}>Teste de Vazão Controlado</h2>
          <div>
            <ExperimentControl
              onStart={startCollection}
              onFinish={handleFinish}
              onReset={handleReset}
            />
          </div>

          <ExperimentResult result={result} />
          <ExperimentTable rows={rows} />
        </div>
      </div>
    </div>
  )
}

export default App


