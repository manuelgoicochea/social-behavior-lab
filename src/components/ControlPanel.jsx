import { useSimulationStore } from '../store/simulationStore.js'
import { formatTick } from '../simulation/replay.js'

const SPEEDS = [0.5, 1, 2, 4]

export default function ControlPanel({ onComputeMetrics, onReplay }) {
  const status = useSimulationStore(s => s.status)
  const speed = useSimulationStore(s => s.speed)
  const tick = useSimulationStore(s => s.tick)
  const replayFrames = useSimulationStore(s => s.replayFrames)
  const experimentName = useSimulationStore(s => s.experimentName)
  const startSimulation = useSimulationStore(s => s.startSimulation)
  const pauseSimulation = useSimulationStore(s => s.pauseSimulation)
  const resetSimulation = useSimulationStore(s => s.resetSimulation)
  const setSpeed = useSimulationStore(s => s.setSpeed)
  const setView = useSimulationStore(s => s.setView)

  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isIdle = status === 'idle'
  const isReplay = status === 'replay'

  return (
    <div className="flex items-center gap-3 bg-gray-900/95 border border-gray-800 rounded-2xl px-4 py-3 shadow-xl flex-wrap">
      {/* Nombre experimento */}
      <div className="text-sm font-medium text-gray-400 hidden sm:block">
        <span className="text-gray-600">Exp:</span>{' '}
        <span className="text-gray-200">{experimentName}</span>
      </div>

      <div className="w-px h-5 bg-gray-700 hidden sm:block" />

      {/* Play / Pausa */}
      {isIdle ? (
        <button
          onClick={startSimulation}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all"
        >
          <span>▶</span> Iniciar experimento
        </button>
      ) : isReplay ? (
        <button
          onClick={onReplay}
          className="flex items-center gap-2 px-4 py-2 bg-violet-700 hover:bg-violet-600 text-white text-sm font-semibold rounded-xl transition-all"
        >
          ⏹ Detener replay
        </button>
      ) : (
        <button
          onClick={pauseSimulation}
          className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all ${
            isRunning
              ? 'bg-amber-600/80 hover:bg-amber-600'
              : 'bg-green-700/80 hover:bg-green-700'
          }`}
        >
          {isRunning ? '⏸ Pausar' : '▶ Reanudar'}
        </button>
      )}

      {/* Reiniciar */}
      {!isIdle && (
        <button
          onClick={resetSimulation}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-all border border-gray-700"
        >
          ↺ Reiniciar
        </button>
      )}

      {/* Velocidad */}
      {(isRunning || isPaused) && (
        <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1 border border-gray-700">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                speed === s
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              x{s}
            </button>
          ))}
        </div>
      )}

      {/* Ticker */}
      {!isIdle && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
          <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : isReplay ? 'bg-violet-400 animate-pulse' : 'bg-gray-600'}`} />
          {isReplay ? 'REPLAY' : formatTick(tick)}
        </div>
      )}

      <div className="flex-1" />

      {/* Métricas */}
      {(isPaused || isIdle) && tick > 0 && (
        <button
          onClick={onComputeMetrics}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl border border-gray-700 transition-all"
        >
          📊 Métricas
        </button>
      )}

      {/* Ver Replay */}
      {replayFrames.length > 0 && !isReplay && (
        <button
          onClick={onReplay}
          className="flex items-center gap-2 px-3 py-2 bg-violet-900/50 hover:bg-violet-800/50 text-violet-300 text-sm font-medium rounded-xl border border-violet-700/40 transition-all"
        >
          ⏮ Ver replay
        </button>
      )}

      {/* Ir al editor */}
      <button
        onClick={() => setView('editor')}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-medium rounded-xl border border-gray-700 transition-all"
      >
        ✏️ Editor
      </button>
    </div>
  )
}
