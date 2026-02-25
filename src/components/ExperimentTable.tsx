import type { ExperimentRow } from "../types/ExperimentRow"
import { numberCSV, dateCSV } from "../utils/numberCSV"
import { useRef } from "react"

interface Props {
    rows: ExperimentRow[]
}

export function ExperimentTable({ rows }: Props) {
    const textRef = useRef<HTMLTextAreaElement>(null)

    if (rows.length === 0) return null

    const text = [
        "Volume Bomba,Volume Saída,Média Diferença,Data",
        ...rows.map(
            (r) =>
                `${numberCSV(r.totalIn)},${numberCSV(r.totalOut)},${numberCSV(
                    r.avgDiff,
                    4
                )},${dateCSV(r.timestamp)}`
        ),
    ].join("\n")

    async function copy() {
        await navigator.clipboard.writeText(text)
    }

    function selectAll() {
        textRef.current?.select()
    }

    return (
        <div style={{
            marginTop: 30,
            padding: "20px",
            backgroundColor: "#f8f9fa",
            border: '1px solid #ddd',
            borderRadius: "8px",
        }}>
            <h2 style={{ marginTop: 0, color: "#333", marginBottom: 16 }}>
                Resultados (Copiar para Planilhas)
            </h2>

            <button 
                onClick={copy}
                style={{
                    padding: "10px 16px",
                    backgroundColor: "#0969da",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0860ca"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0969da"}
            >
                📋 Copiar Tudo
            </button>

            <textarea
                ref={textRef}
                value={text}
                readOnly
                onFocus={selectAll}
                style={{
                    width: "100%",
                    height: 120,
                    marginTop: 12,
                    padding: "12px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    border: "1px solid #d0d7de",
                    borderRadius: "6px",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                    resize: "vertical",
                }}
            />
        </div>
    )
}