import { useSimulationStore } from '../store/simulationStore.js'
import { EXPERIMENTS, generateRandomExperiment } from '../simulation/experiments.js'
import { useT } from '../i18n/useT.js'

export default function ExperimentSelector({ onClose }) {
  const t = useT()
  const loadExperiment = useSimulationStore(s => s.loadExperiment)
  const setView        = useSimulationStore(s => s.setView)

  function handleSelect(experiment) {
    loadExperiment(experiment)
    setView('simulation')
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
      {/* Sheet on mobile, modal on sm+ */}
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          {/* Pull indicator on mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full sm:hidden" />
          <div className="mt-2 sm:mt-0">
            <h2 className="text-lg sm:text-xl font-bold text-white">{t('experiments.title')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{t('experiments.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex-shrink-0 mt-2 sm:mt-0"
          >
            ✕
          </button>
        </div>

        <div className="p-3 sm:p-6 space-y-2.5 sm:space-y-3">
          {EXPERIMENTS.map(exp => (
            <button
              key={exp.key}
              onClick={() => handleSelect(exp)}
              className="w-full text-left px-4 sm:px-5 py-4 bg-gray-800/60 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl transition-all group"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-2xl flex-shrink-0 mt-0.5">{exp.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm sm:text-base group-hover:text-blue-300 transition-colors">
                    {t('exp.' + exp.key + '.name')}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm mt-0.5 leading-relaxed">
                    {t('exp.' + exp.key + '.desc')}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {exp.agents.map(agent => (
                      <div
                        key={agent.id}
                        title={`${agent.name} (${t('personality.' + agent.personality)})`}
                        className="w-5 h-5 rounded-full border-2 border-gray-700 flex-shrink-0"
                        style={{ background: agent.color }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-lg flex-shrink-0 self-center">
                  →
                </span>
              </div>
            </button>
          ))}

          {/* Random experiment */}
          <button
            onClick={() => handleSelect(generateRandomExperiment())}
            className="w-full text-left px-4 sm:px-5 py-4 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-700/40 hover:border-indigo-600/60 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl flex-shrink-0">🎲</span>
              <div className="flex-1 min-w-0">
                <div className="text-indigo-300 font-semibold text-sm sm:text-base group-hover:text-indigo-200 transition-colors">
                  {t('experiments.random.title')}
                </div>
                <div className="text-indigo-500 text-xs sm:text-sm mt-0.5">
                  {t('experiments.random.desc')}
                </div>
              </div>
              <span className="text-indigo-700 group-hover:text-indigo-500 transition-colors text-lg flex-shrink-0">
                →
              </span>
            </div>
          </button>

          {/* Bottom safe area */}
          <div className="h-2 sm:h-0" />
        </div>
      </div>
    </div>
  )
}
