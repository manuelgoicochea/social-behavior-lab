import { useT } from '../i18n/useT.js'

export default function MetricsPanel({ metrics, onClose }) {
  const t = useT()
  if (!metrics) return null

  const { totalInteractions, totalRejections, avgInteractionDuration, mostSocial, mostIsolated, mostAnxious, bestPair, narrative } = metrics

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-white">{t('metrics.title')}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{t('metrics.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label={t('metrics.interactions')} value={totalInteractions} icon="🤝" color="green" />
            <MetricCard label={t('metrics.rejections')} value={totalRejections} icon="🚫" color="red" />
            <MetricCard label={t('metrics.avgDuration')} value={`${avgInteractionDuration}s`} icon="⏱" color="blue" />
            {mostAnxious && (
              <MetricCard
                label={t('metrics.highestAnxiety')}
                value={`${mostAnxious.name} (${Math.round(mostAnxious.emotion.ansiedad)})`}
                icon="😰"
                color="orange"
              />
            )}
          </div>

          <div className="space-y-3">
            {mostSocial && (
              <AgentHighlight
                label={t('metrics.mostSocial')}
                agent={mostSocial}
                icon="🌟"
                colorClass="border-green-700/40 bg-green-950/30"
                t={t}
              />
            )}
            {mostIsolated && mostIsolated.id !== mostSocial?.id && (
              <AgentHighlight
                label={t('metrics.mostIsolated')}
                agent={mostIsolated}
                icon="🧍"
                colorClass="border-gray-700/40 bg-gray-900/60"
                t={t}
              />
            )}
            {bestPair && (
              <div className="rounded-xl border border-blue-700/40 bg-blue-950/30 px-4 py-3">
                <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
                  💙 {t('metrics.bestBond')}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: bestPair.agentA.color }} />
                  <span className="text-white text-sm font-medium">{bestPair.agentA.name}</span>
                  <span className="text-gray-500 text-xs">{t('metrics.and')}</span>
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: bestPair.agentB.color }} />
                  <span className="text-white text-sm font-medium">{bestPair.agentB.name}</span>
                  <span className="text-gray-500 text-xs ml-auto">{bestPair.count} {t('metrics.times')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-xl px-5 py-4">
            <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📝 {t('metrics.narrative')}</div>
            <p className="text-gray-300 text-sm leading-relaxed">{narrative}</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium rounded-xl transition-all"
          >
            {t('metrics.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon, color }) {
  const colors = {
    green: 'border-green-700/40 bg-green-950/30 text-green-300',
    red: 'border-red-700/40 bg-red-950/30 text-red-300',
    blue: 'border-blue-700/40 bg-blue-950/30 text-blue-300',
    orange: 'border-orange-700/40 bg-orange-950/30 text-orange-300',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 ${colors[color] || colors.blue}`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function AgentHighlight({ label, agent, icon, colorClass, t }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${colorClass}`}>
      <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">
        {icon} {label}
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: agent.color }} />
        <span className="text-white text-sm font-semibold">{agent.name}</span>
        <span className="text-gray-500 text-xs capitalize">({t('personality.' + agent.personality)})</span>
      </div>
    </div>
  )
}
