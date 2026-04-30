import { useState } from 'react'
import { useSimulationStore } from '../store/simulationStore.js'
import { PERSONALITIES, createAgent } from '../simulation/personalities.js'

const EMOTION_KEYS = [
  { key: 'soledad', label: 'Soledad', color: '#60a5fa' },
  { key: 'sociabilidad', label: 'Sociabilidad', color: '#4ade80' },
  { key: 'ansiedad', label: 'Ansiedad', color: '#fb923c' },
  { key: 'confianza', label: 'Confianza', color: '#facc15' },
  { key: 'energiaSocial', label: 'Energía social', color: '#a78bfa' },
]

const PRESET_COLORS = [
  '#f59e0b', '#6366f1', '#ef4444', '#8b5cf6', '#10b981',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
]

export default function CharacterEditor() {
  const agents = useSimulationStore(s => s.agents)
  const editAgent = useSimulationStore(s => s.editAgent)
  const addAgent = useSimulationStore(s => s.addAgent)
  const removeAgent = useSimulationStore(s => s.removeAgent)
  const setView = useSimulationStore(s => s.setView)
  const loadExperiment = useSimulationStore(s => s.loadExperiment)

  const [selectedId, setSelectedId] = useState(agents[0]?.id || null)
  const selected = agents.find(a => a.id === selectedId)

  function handleEmotionChange(key, value) {
    if (!selected) return
    editAgent(selected.id, {
      emotion: { ...selected.emotion, [key]: Number(value) },
    })
  }

  function handlePersonalityPreset(personality) {
    if (!selected) return
    const p = PERSONALITIES[personality]
    editAgent(selected.id, {
      personality,
      color: p.color,
      emotion: { ...p.emotion },
    })
  }

  function handleAddAgent() {
    if (agents.length >= 6) return
    const names = ['Nuevo', 'Agente', 'Personaje', 'Actor', 'Sujeto', 'Extra']
    const name = names[agents.length] || `Agente ${agents.length + 1}`
    const agent = createAgent(
      `custom_${Date.now()}`,
      name,
      'neutral',
      [(Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 12]
    )
    addAgent(agent)
    setSelectedId(agent.id)
  }

  function handleStartSimulation() {
    setView('simulation')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('landing')}
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            ← Inicio
          </button>
          <span className="text-gray-700">/</span>
          <h1 className="text-lg font-bold text-white">Editor de personajes</h1>
        </div>
        <button
          onClick={handleStartSimulation}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all"
        >
          ▶ Iniciar simulación
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Lista de agentes */}
        <div className="w-64 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">Personajes ({agents.length}/6)</span>
            <button
              onClick={handleAddAgent}
              disabled={agents.length >= 6}
              className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 rounded-lg text-sm font-bold transition-all"
            >
              +
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedId(agent.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                  selectedId === agent.id
                    ? 'bg-indigo-900/40 border border-indigo-700/50'
                    : 'bg-gray-900/60 border border-gray-800 hover:border-gray-700'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: agent.color }}
                >
                  {agent.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{agent.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{agent.personality}</div>
                </div>
                {agents.length > 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedId === agent.id) setSelectedId(agents.find(a => a.id !== agent.id)?.id || null)
                      removeAgent(agent.id)
                    }}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Editor del agente seleccionado */}
        {selected ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nombre</label>
              <input
                type="text"
                value={selected.name}
                onChange={e => editAgent(selected.id, { name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                maxLength={20}
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => editAgent(selected.id, { color: c })}
                    className={`w-8 h-8 rounded-full transition-all ${selected.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-110' : 'hover:scale-105'}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Personalidad preset */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Personalidad base</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(PERSONALITIES).map(p => (
                  <button
                    key={p.key}
                    onClick={() => handlePersonalityPreset(p.key)}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                      selected.personality === p.key
                        ? 'border-indigo-600 bg-indigo-900/40 text-white'
                        : 'border-gray-700 bg-gray-900/60 text-gray-400 hover:border-gray-600 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders emocionales */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Variables emocionales</label>
              <div className="space-y-4">
                {EMOTION_KEYS.map(({ key, label, color }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-300">{label}</span>
                      <span className="text-sm font-mono font-bold" style={{ color }}>
                        {Math.round(selected.emotion[key])}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={selected.emotion[key]}
                      onChange={e => handleEmotionChange(key, e.target.value)}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ accentColor: color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Descripción personalidad */}
            {PERSONALITIES[selected.personality] && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {PERSONALITIES[selected.personality].description}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            Selecciona un personaje para editarlo
          </div>
        )}
      </div>
    </div>
  )
}
