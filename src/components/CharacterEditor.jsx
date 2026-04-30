import { useState } from 'react'
import { useSimulationStore } from '../store/simulationStore.js'
import { PERSONALITIES, createAgent } from '../simulation/personalities.js'
import { useT, useLanguage } from '../i18n/useT.js'

const EMOTION_KEYS = [
  { key: 'soledad', color: '#60a5fa' },
  { key: 'sociabilidad', color: '#4ade80' },
  { key: 'ansiedad', color: '#fb923c' },
  { key: 'confianza', color: '#facc15' },
  { key: 'energiaSocial', color: '#a78bfa' },
]

const PRESET_COLORS = [
  '#f59e0b', '#6366f1', '#ef4444', '#8b5cf6', '#10b981',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
]

export default function CharacterEditor() {
  const t = useT()
  const { language, setLanguage } = useLanguage()
  const agents = useSimulationStore(s => s.agents)
  const editAgent = useSimulationStore(s => s.editAgent)
  const addAgent = useSimulationStore(s => s.addAgent)
  const removeAgent = useSimulationStore(s => s.removeAgent)
  const setView = useSimulationStore(s => s.setView)

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

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('landing')}
            className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
          >
            {t('editor.back')}
          </button>
          <span className="text-gray-700">/</span>
          <h1 className="text-lg font-bold text-white">{t('editor.title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            {['es', 'en'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all uppercase ${
                  language === lang ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button
            onClick={() => setView('simulation')}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all"
          >
            {t('editor.startSim')}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">{t('editor.characters')} ({agents.length}/6)</span>
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
                  <div className="text-xs text-gray-500">{t('personality.' + agent.personality)}</div>
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

        {selected ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('editor.name')}</label>
              <input
                type="text"
                value={selected.name}
                onChange={e => editAgent(selected.id, { name: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('editor.color')}</label>
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

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('editor.personality')}</label>
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
                      {t('personality.' + p.key)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('editor.emotions')}</label>
              <div className="space-y-4">
                {EMOTION_KEYS.map(({ key, color }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-300">{t('emotion.' + key)}</span>
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

            {PERSONALITIES[selected.personality] && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t('personality.desc.' + selected.personality)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            {t('editor.select')}
          </div>
        )}
      </div>
    </div>
  )
}
