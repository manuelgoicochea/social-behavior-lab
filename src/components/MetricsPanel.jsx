import { useT } from '../i18n/useT.js'

export default function MetricsPanel({ metrics, onClose }) {
  const t = useT()
  if (!metrics) return null

  const {
    totalInteractions, totalRejections, avgInteractionDuration,
    mostSocial, mostIsolated, mostAnxious, bestPair, narrative,
  } = metrics

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
      {/* Sheet on mobile (slides from bottom), modal on sm+ */}
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-xl max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          {/* Pull indicator on mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full sm:hidden" />
          <div className="mt-2 sm:mt-0">
            <h2 className="text-lg sm:text-xl font-bold text-white">{t('metrics.title')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{t('metrics.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex-shrink-0 mt-2 sm:mt-0"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

          {/* Metric cards — 2 columns always */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
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

          {/* Agent highlights */}
          <div className="space-y-2.5 sm:space-y-3">
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
                <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">
                  💙 {t('metrics.bestBond')}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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

          {/* Narrative */}
          <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-xl px-4 py-4">
            <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">
              📝 {t('metrics.narrative')}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{narrative}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium rounded-xl transition-all text-sm"
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
    green:  'border-green-700/40 bg-green-950/30 text-green-300',
    red:    'border-red-700/40 bg-red-950/30 text-red-300',
    blue:   'border-blue-700/40 bg-blue-950/30 text-blue-300',
    orange: 'border-orange-700/40 bg-orange-950/30 text-orange-300',
  }
  return (
    <div className={`rounded-xl border px-3 py-3 sm:px-4 ${colors[color] || colors.blue}`}>
      <div className="text-lg sm:text-xl mb-1">{icon}</div>
      <div className="text-xl sm:text-2xl font-bold text-white leading-tight">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5 leading-tight">{label}</div>
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
        <span className="text-gray-500 text-xs">({t('personality.' + agent.personality)})</span>
      </div>
    </div>
  )
}
