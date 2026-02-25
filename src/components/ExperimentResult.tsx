import { numberCSV } from "../utils/numberCSV"

type Props = {
  result: {
    duration: number
    totalIn: number
    totalOut: number
    avgDiff: number
  } | null
}

// quero deixar a table com o fundo branco
const styles = {
  container: { marginTop: 20, padding: 20, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f9f9f9' },
  table: { borderCollapse: 'collapse' as const, width: '100%', marginTop: 10, backgroundColor: '#fff' },
  cell: { border: '1px solid #ddd', padding: '8px' },
  th: { border: '1px solid #ddd', padding: '8px', textAlign: 'left' as const },
  td: { border: '1px solid #ddd', padding: '8px' },
}

export function ExperimentResult({ result }: Props) {
  if (!result) return null

  return (
    <div style={styles.container}>
      <h2>Resultado do Ensaio ({result.duration}s)</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Volume Bomba (L)</th>
            <th style={styles.th}>Volume Saída (L)</th>
            <th style={styles.th}>Média Diferença (L/min)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>{numberCSV(result.totalIn, 3)}</td>
            <td style={styles.td}>{numberCSV(result.totalOut, 3)}</td>
            <td style={styles.td}>{numberCSV(result.avgDiff, 4)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
