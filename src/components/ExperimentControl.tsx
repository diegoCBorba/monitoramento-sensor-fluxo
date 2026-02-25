import { useRef, useState } from "react"

interface Props {
    onStart: () => void
    onFinish: (duration: number) => void
    onReset: () => void
}

export function ExperimentControl({ onStart, onFinish, onReset }: Props) {
    const [seconds, setSeconds] = useState(30)
    const [running, setRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    const intervalRef = useRef<number | null>(null)
    const audioCtxRef = useRef<AudioContext | null>(null)

    // 🔊 cria um "beep" curto
    function beep(duration = 150, frequency = 880, volume = 0.25) {
        if (!audioCtxRef.current) return

        const ctx = audioCtxRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.frequency.value = frequency
        osc.type = "sine"

        // envelope (fade in/out curto pra ficar profissional)
        const now = ctx.currentTime
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(volume, now + 0.01)
        gain.gain.linearRampToValueAtTime(0, now + duration / 1000)

        osc.start(now)
        osc.stop(now + duration / 1000)
    }

    function countdownBeep(timeLeft: number) {
        switch (timeLeft) {
            case 3:
                // médio
                beep(180, 900)
                break
            case 2:
                // mais agudo
                beep(180, 1200)
                break
            case 1:
                // bem agudo (atenção máxima)
                beep(220, 1600)
                break
        }
    }
    function start() {
        // necessário para permitir áudio (gesture do usuário)
        audioCtxRef.current = new AudioContext()

        setRunning(true)
        setTimeLeft(seconds)
        onStart()

        intervalRef.current = window.setInterval(() => {
            setTimeLeft((t) => {
                // 🔊 beep nos últimos 5 segundos
                if (t <= 10 && t > 3) {
                    beep()
                }

                if (t <= 3 && t >= 1) {
                    countdownBeep(t)
                }
                if (t <= 1) {
                    clearInterval(intervalRef.current!)
                    intervalRef.current = null

                    setRunning(false)
                    onFinish(seconds)

                    // beep final mais grave
                    beep(300, 440)

                    return 0
                }

                return t - 1
            })
        }, 1000)
    }

    function reset() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        setRunning(false)
        setTimeLeft(0)

        onReset()
    }

    return (
        <div style={{ 
            marginBottom: 20,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: '#f9f9f9',
            width: '100%'
        }}>
            <h2 style={{ marginTop: 0, color: '#333' }}>Ensaio de Vazão</h2>

            <div style={{ marginBottom: 15 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                    Duração (segundos):
                </label>
                <input
                    type="number"
                    min={1}
                    value={seconds}
                    disabled={running}
                    onChange={(e) => setSeconds(Number(e.target.value))}
                    style={{
                        width: '100%',
                        padding: 10,
                        fontSize: 16,
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        boxSizing: 'border-box',
                        opacity: running ? 0.6 : 1
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                <button 
                    onClick={start} 
                    disabled={running}
                    style={{
                        flex: 1,
                        padding: 10,
                        fontSize: 16,
                        fontWeight: 600,
                        backgroundColor: running ? '#ccc' : '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: running ? 'not-allowed' : 'pointer'
                    }}
                >
                    Iniciar
                </button>

                <button 
                    onClick={reset}
                    style={{
                        flex: 1,
                        padding: 10,
                        fontSize: 16,
                        fontWeight: 600,
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer'
                    }}
                >
                    Reset
                </button>
            </div>

            {running && (
                <div style={{
                    padding: 15,
                    backgroundColor: '#e3f2fd',
                    borderLeft: '4px solid #2196F3',
                    borderRadius: 4,
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: 24, fontWeight: 700, color: '#1976D2', margin: 0 }}>
                        ⏱ {timeLeft}s
                    </p>
                    <p style={{ fontSize: 14, color: '#666', margin: '5px 0 0' }}>
                        Coletando dados...
                    </p>
                </div>
            )}
        </div>
    )
}