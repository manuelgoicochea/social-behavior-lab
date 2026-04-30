import { useSimulationStore } from '../store/simulationStore.js'
import { EXPERIMENTS, generateRandomExperiment } from '../simulation/experiments.js'

export default function ExperimentSelector({ onClose }) {
  const loadExperiment = useSimulationStore(s => s.loadExperiment)
  const setView = useSimulationStore(s => s.setView)

  function handleSelect(experiment) {
    loadExperiment(experiment)
    setView('simulation')
    onClose?.()
  }

  function handleRandom() {
    handleSelect(generateRandomExperiment())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">Escenarios predefinidos</h2>
            <p className="text-sm text-gray-500 mt-0.5">Elige un experimento para comenzar</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {EXPERIMENTS.map(exp => (
            <button
              key={exp.key}
              onClick={() => handleSelect(exp)}
              className="w-full text-left px-5 py-4 bg-gray-800/60 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{exp.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                    {exp.name}
                  </div>
                  <div className="text-gray-500 text-sm mt-0.5 leading-relaxed">
                    {exp.description}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {exp.agents.map(agent => (
                      <div
                        key={agent.id}
                        title={`${agent.name} (${agent.personality})`}
                        className="w-5 h-5 rounded-full border-2 border-gray-700"
                        style={{ background: agent.color }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-lg flex-shrink-0">→</span>
              </div>
            </button>
          ))}

          {/* Botón aleatorio */}
          <button
            onClick={handleRandom}
            className="w-full text-left px-5 py-4 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-700/40 hover:border-indigo-600/60 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🎲</span>
              <div>
                <div className="text-indigo-300 font-semibold group-hover:text-indigo-200 transition-colors">
                  Generar escenario aleatorio
                </div>
                <div className="text-indigo-500 text-sm mt-0.5">
                  Combinación aleatoria de personalidades y agentes
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
