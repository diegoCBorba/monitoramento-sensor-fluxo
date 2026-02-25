import type { FlowData } from "../types/FlowData";

interface Props {
  data: FlowData | null
}

export function Metrics({ data }: Props) {
  return (
    <div style={{ paddingBottom: "20px" }}>
      {data ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          <Metric title="Vazão Bomba" value={`${data.flow1.toFixed(2)}`} unit="L/min" />
          <Metric title="Vazão Ladrão" value={`${data.flow2.toFixed(2)}`} unit="L/min" />
          <Metric title="Diferença" value={`${data.diff_abs.toFixed(3)}`} unit="L/min" />
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
          <p style={{ fontSize: 16 }}>⏳ Aguardando leitura do sensor...</p>
        </div>
      )}
    </div>
  )
}

function Metric({ title, value, unit }: { title: string; value: string; unit: string }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: "linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.5)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
      }}
    >
      <p style={{ margin: "0 0 8px 0", fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 28, fontWeight: "bold" }}>{value}</span>
        <span style={{ fontSize: 12, color: "#888" }}>{unit}</span>
      </div>
    </div>
  )
}