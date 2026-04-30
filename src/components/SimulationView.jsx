import { useEffect, useRef, useState } from 'react'
import { useSimulationStore } from '../store/simulationStore.js'
import {
  initEngine,
  startEngine,
  stopEngine,
  updateSpeed,
  computeFinalMetrics,
} from '../simulation/engine.js'
import { getFrameAtTick } from '../simulation/replay.js'
import SimulationCanvas from './SimulationCanvas.jsx'
import ControlPanel from './ControlPanel.jsx'
import EventLog from './EventLog.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import ExperimentSelector from './ExperimentSelector.jsx'

export default function SimulationView() {
  const store = useSimulationStore
  const status = useSimulationStore(s => s.status)
  const speed = useSimulationStore(s => s.speed)
  const replayFrames = useSimulationStore(s => s.replayFrames)
  const replayTick = useSimulationStore(s => s.replayTick)
  const setReplayTick = useSimulationStore(s => s.setReplayTick)
  const startReplay = useSimulationStore(s => s.startReplay)
  const stopReplay = useSimulationStore(s => s.stopReplay)
  const updateAgent = useSimulationStore(s => s.updateAgent)
  const setMetrics = useSimulationStore(s => s.setMetrics)
  const metrics = useSimulationStore(s => s.metrics)
  const setView = useSimulationStore(s => s.setView)

  const [showMetrics, setShowMetrics] = useState(false)
  const [showExperiments, setShowExperiments] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(null)

  const replayRef = useRef(null)
  const replayTickRef = useRef(0)

  // Inicializar motor
  useEffect(() => {
    initEngine(useSimulationStore)
    return () => stopEngine()
  }, [])

  // Reaccionar a cambios de status
  useEffect(() => {
    if (status === 'running') {
      startEngine()
    } else if (status === 'paused' || status === 'idle') {
      stopEngine()
    } else if (status === 'replay') {
      stopEngine()
    }
  }, [status])

  // Reaccionar a cambios de velocidad
  useEffect(() => {
    if (status === 'running') {
      updateSpeed(speed)
    }
  }, [speed, status])

  // Loop de replay
  useEffect(() => {
    if (status !== 'replay') {
      if (replayRef.current) {
        clearInterval(replayRef.current)
        replayRef.current = null
      }
      return
    }

    replayTickRef.current = 0
    replayRef.current = setInterval(() => {
      const next = replayTickRef.current + 1
      if (next >= replayFrames.length) {
        clearInterval(replayRef.current)
        replayRef.current = null
        stopReplay()
        return
      }
      replayTickRef.current = next
      setReplayTick(next)
      const frame = replayFrames[next]
      if (frame) {
        frame.agents.forEach(agentSnap => {
          updateAgent(agentSnap.id, {
            position: agentSnap.position,
            state: agentSnap.state,
            emotion: agentSnap.emotion,
          })
        })
      }
    }, 100)

    return () => {
      if (replayRef.current) clearInterval(replayRef.current)
    }
  }, [status, replayFrames])

  function handleComputeMetrics() {
    const m = computeFinalMetrics()
    setMetrics(m)
    setShowMetrics(true)
  }

  function handleReplayToggle() {
    if (status === 'replay') {
      stopReplay()
    } else {
      startReplay()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800 flex items-center gap-3">
        <button
          onClick={() => setView('landing')}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-300 transition-colors text-sm flex-shrink-0"
        >
          ← <span className="hidden sm:inline">Inicio</span>
        </button>

        <div className="flex-1">
          <ControlPanel
            onComputeMetrics={handleComputeMetrics}
            onReplay={handleReplayToggle}
          />
        </div>

        <button
          onClick={() => setShowExperiments(true)}
          className="flex-shrink-0 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-all"
        >
          🧪 Escenarios
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas 3D */}
        <div className="flex-1 relative">
          <SimulationCanvas onAgentClick={setSelectedAgent} />

          {/* Overlay info agente seleccionado */}
          {selectedAgent && (
            <AgentInfoCard
              agentId={selectedAgent.id}
              onClose={() => setSelectedAgent(null)}
            />
          )}

          {/* Overlay estado idle */}
          {status === 'idle' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-gray-900/80 border border-gray-700 rounded-2xl px-8 py-6 text-center max-w-sm pointer-events-auto">
                <div className="text-4xl mb-3">🧬</div>
                <h3 className="text-white font-bold text-lg mb-2">Simulación lista</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Presiona <strong className="text-white">Iniciar experimento</strong> para observar cómo interactúan los agentes.
                </p>
                <button
                  onClick={() => setShowExperiments(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm underline-offset-2 hover:underline"
                >
                  Cambiar escenario →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel lateral de eventos */}
        <div className="w-72 flex-shrink-0 border-l border-gray-800 p-3">
          <EventLog />
        </div>
      </div>

      {/* Modales */}
      {showMetrics && metrics && (
        <MetricsPanel metrics={metrics} onClose={() => setShowMetrics(false)} />
      )}
      {showExperiments && (
        <ExperimentSelector onClose={() => setShowExperiments(false)} />
      )}
    </div>
  )
}

function AgentInfoCard({ agentId, onClose }) {
  const agent = useSimulationStore(s => s.agents.find(a => a.id === agentId))

  if (!agent) return null

  const emotionItems = [
    { label: 'Soledad', value: agent.emotion.soledad, color: '#60a5fa' },
    { label: 'Sociabilidad', value: agent.emotion.sociabilidad, color: '#4ade80' },
    { label: 'Ansiedad', value: agent.emotion.ansiedad, color: '#fb923c' },
    { label: 'Confianza', value: agent.emotion.confianza, color: '#facc15' },
    { label: 'Energía', value: agent.emotion.energiaSocial, color: '#a78bfa' },
  ]

  return (
    <div className="absolute top-4 left-4 bg-gray-900/95 border border-gray-700 rounded-2xl shadow-xl p-4 w-60 z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full" style={{ background: agent.color }} />
          <span className="text-white font-bold text-sm">{agent.name}</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
      </div>
      <div className="text-xs text-gray-500 capitalize mb-3">{agent.personality} · {agent.state}</div>
      <div className="space-y-2">
        {emotionItems.map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{label}</span>
              <span className="font-mono font-bold" style={{ color }}>{Math.round(value)}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${value}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-white text-xs font-bold">{agent.history.interactions}</div>
          <div className="text-gray-600 text-xs">interacc.</div>
        </div>
        <div>
          <div className="text-white text-xs font-bold">{agent.history.accepted}</div>
          <div className="text-gray-600 text-xs">aceptadas</div>
        </div>
        <div>
          <div className="text-white text-xs font-bold">{agent.history.rejections}</div>
          <div className="text-gray-600 text-xs">rechazos</div>
        </div>
      </div>
    </div>
  )
}
