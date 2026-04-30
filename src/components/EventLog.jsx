import { useSimulationStore } from '../store/simulationStore.js'

const COLOR_MAP = {
  green: { bg: 'bg-green-950/40', border: 'border-green-800/40', dot: 'bg-green-400', text: 'text-green-300' },
  red: { bg: 'bg-red-950/40', border: 'border-red-800/40', dot: 'bg-red-400', text: 'text-red-300' },
  orange: { bg: 'bg-orange-950/40', border: 'border-orange-800/40', dot: 'bg-orange-400', text: 'text-orange-300' },
  gray: { bg: 'bg-gray-900/40', border: 'border-gray-700/40', dot: 'bg-gray-500', text: 'text-gray-400' },
  blue: { bg: 'bg-blue-950/40', border: 'border-blue-800/40', dot: 'bg-blue-400', text: 'text-blue-300' },
}

export default function EventLog() {
  const events = useSimulationStore(s => s.events)
  const status = useSimulationStore(s => s.status)

  return (
    <div className="flex flex-col h-full bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-200">Eventos</span>
          {status === 'running' && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-xs text-gray-600">{events.length} eventos</span>
      </div>

      {/* Lista */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="text-3xl mb-3">🔬</div>
            <p className="text-gray-600 text-sm">Los eventos aparecerán aquí cuando inicies la simulación.</p>
          </div>
        ) : (
          events.map(event => {
            const c = COLOR_MAP[event.color] || COLOR_MAP.gray
            return (
              <div
                key={event.id}
                className={`${c.bg} ${c.border} border rounded-xl px-3 py-2 flex items-start gap-2`}
              >
                <span className={`mt-1 w-1.5 h-1.5 flex-shrink-0 rounded-full ${c.dot}`} />
                <p className={`text-xs leading-relaxed ${c.text}`}>
                  {event.message}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
