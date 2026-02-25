import { useEffect, useRef, useState } from "react"
import type { FlowData } from "../types/FlowData"

export function useFlowSocket() {
  const [liveData, setLiveData] = useState<FlowData | null>(null)

  const wsRef = useRef<WebSocket | null>(null)

  
  // Estados do experimento
  const collectingRef = useRef(false)
  const bufferRef = useRef<FlowData[]>([])
  
  useEffect(() => {
    // prefer env var `VITE_WS_URL`, otherwise derive from current host (same machine fallback)
    const defaultHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const defaultProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = (import.meta as any).env?.VITE_WS_URL ?? `${defaultProtocol}//${defaultHost}:81`
    console.log('[useFlowSocket] connecting to', wsUrl)
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    
    ws.onmessage = (event) => {
      const parsed: FlowData = JSON.parse(event.data)
      
      setLiveData(parsed)
      
      // 👇 só armazena se estiver coletando
      if (collectingRef.current) {
        bufferRef.current.push(parsed)
      }
    }
    
    return () => ws.close()
  }, [])
  
  // 🚀 inicia coleta
  function startCollection() {
    bufferRef.current = []
    collectingRef.current = true
  }

  // 🛑 finaliza coleta e calcula métricas
  function stopCollection(duration: number) {
    collectingRef.current = false

    const samples = bufferRef.current

    if (samples.length === 0) return null

    // tempo entre amostras (1 s no seu mock)
    const dt = duration / samples.length

    let totalIn = 0
    let totalOut = 0
    let diffSum = 0

    samples.forEach((s) => {
      totalIn += s.flow1 * dt / 60
      totalOut += s.flow2 * dt / 60
      diffSum += s.diff_ma
    })

    return {
      duration,
      totalIn,
      totalOut,
      avgDiff: diffSum / samples.length,
    }
  }

  return { liveData, startCollection, stopCollection }
}