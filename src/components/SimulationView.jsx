import { useEffect, useRef, useState } from 'react'
import { useSimulationStore } from '../store/simulationStore.js'
import {
  initEngine, startEngine, stopEngine, updateSpeed, computeFinalMetrics,
} from '../simulation/engine.js'
import SimulationCanvas from './SimulationCanvas.jsx'
import ControlPanel from './ControlPanel.jsx'
import EventLog from './EventLog.jsx'
import MetricsPanel from './MetricsPanel.jsx'
import ExperimentSelector from './ExperimentSelector.jsx'
import { useT, useLanguage } from '../i18n/useT.js'

export default function SimulationView() {
  const t = useT()
  const { language, setLanguage } = useLanguage()
  const status       = useSimulationStore(s => s.status)
  const speed        = useSimulationStore(s => s.speed)
  const replayFrames = useSimulationStore(s => s.replayFrames)
  const events       = useSimulationStore(s => s.events)
  const setReplayTick = useSimulationStore(s => s.setReplayTick)
  const startReplay  = useSimulationStore(s => s.startReplay)
  const stopReplay   = useSimulationStore(s => s.stopReplay)
  const updateAgent  = useSimulationStore(s => s.updateAgent)
  const setMetrics   = useSimulationStore(s => s.setMetrics)
  const metrics      = useSimulationStore(s => s.metrics)
  const setView      = useSimulationStore(s => s.setView)

  const [showMetrics, setShowMetrics]       = useState(false)
  const [showExperiments, setShowExperiments] = useState(false)
  const [selectedAgent, setSelectedAgent]   = useState(null)
  const [showEvents, setShowEvents]         = useState(false)

  const replayRef     = useRef(null)
  const replayTickRef = useRef(0)

  useEffect(() => {
    initEngine(useSimulationStore)
    return () => stopEngine()
  }, [])

  useEffect(() => {
    if (status === 'running')              startEngine()
    else if (status === 'paused' || status === 'idle') stopEngine()
    else if (status === 'replay')         stopEngine()
  }, [status])

  useEffect(() => {
    if (status === 'running') updateSpeed(speed)
  }, [speed, status])

  useEffect(() => {
    if (status !== 'replay') {
      if (replayRef.current) { clearInterval(replayRef.current); replayRef.current = null }
      return
    }
    replayTickRef.current = 0
    replayRef.current = setInterval(() => {
      const next = replayTickRef.current + 1
      if (next >= replayFrames.length) {
        clearInterval(replayRef.current); replayRef.current = null; stopReplay(); return
      }
      replayTickRef.current = next
      setReplayTick(next)
      const frame = replayFrames[next]
      if (frame) frame.agents.forEach(s => updateAgent(s.id, { position: s.position, state: s.state, emotion: s.emotion }))
    }, 100)
    return () => { if (replayRef.current) clearInterval(replayRef.current) }
  }, [status, replayFrames])

  function handleComputeMetrics() {
    setMetrics(computeFinalMetrics())
    setShowMetrics(true)
  }

  function handleReplayToggle() {
    status === 'replay' ? stopReplay() : startReplay()
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-gray-800">

        {/* Row 1 — nav & tools */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5">
          <button
            onClick={() => setView('landing')}
            className="text-gray-600 hover:text-gray-300 transition-colors text-sm flex-shrink-0 p-1"
          >
            ←
          </button>

          <div className="flex-1" />

          {/* Language toggle */}
          <div className="flex items-center gap-0.5 bg-gray-900 border border-gray-800 rounded-lg p-1">
            {['es', 'en'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all uppercase ${
                  language === lang ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExperiments(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs sm:text-sm font-medium rounded-xl transition-all flex-shrink-0"
          >
            🧪 <span className="hidden sm:inline">{t('ctrl.experiments')}</span>
          </button>
        </div>

        {/* Row 2 — control panel */}
        <div className="px-3 sm:px-4 pb-2 sm:pb-3">
          <ControlPanel
            onComputeMetrics={handleComputeMetrics}
            onReplay={handleReplayToggle}
          />
        </div>
      </div>

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* 3D Canvas */}
        <div className="flex-1 relative min-w-0">
          <SimulationCanvas onAgentClick={setSelectedAgent} />

          {/* Agent info card */}
          {selectedAgent && (
            <AgentInfoCard
              agentId={selectedAgent.id}
              onClose={() => setSelectedAgent(null)}
              t={t}
            />
          )}

          {/* Idle overlay */}
          {status === 'idle' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-gray-950/50 p-4">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl px-6 sm:px-8 py-6 text-center max-w-sm w-full pointer-events-auto">
                <div className="text-4xl mb-3">🧬</div>
                <h3 className="text-white font-bold text-lg mb-2">{t('sim.ready.title')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {t('sim.ready.desc', { btn: t('ctrl.start') })}
                </p>
                <button
                  onClick={() => setShowExperiments(true)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm underline-offset-2 hover:underline"
                >
                  {t('sim.ready.change')}
                </button>
              </div>
            </div>
          )}

          {/* Mobile events toggle button */}
          <button
            onClick={() => setShowEvents(v => !v)}
            className="lg:hidden absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 bg-gray-900/95 border border-gray-700 rounded-xl shadow-lg text-gray-300 text-sm font-medium"
          >
            <span>📋</span>
            <span>{t('events.title')}</span>
            {events.length > 0 && (
              <span className="min-w-[20px] h-5 flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full font-bold px-1">
                {events.length > 99 ? '99+' : events.length}
              </span>
            )}
          </button>
        </div>

        {/* Desktop events panel */}
        <div className="hidden lg:flex w-72 flex-shrink-0 border-l border-gray-800 p-3">
          <EventLog />
        </div>

        {/* Mobile events drawer */}
        {showEvents && (
          <div className="lg:hidden absolute inset-0 z-30 flex flex-col">
            <div className="flex-1 bg-black/50" onClick={() => setShowEvents(false)} />
            <div className="bg-gray-950 border-t border-gray-800 flex flex-col" style={{ height: '55%' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-200">{t('events.title')}</span>
                  {status === 'running' && (
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  )}
                </div>
                <button onClick={() => setShowEvents(false)} className="text-gray-500 hover:text-gray-300 text-lg leading-none p-1">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-3">
                <EventLog hideHeader />
              </div>
            </div>
          </div>
        )}
      </div>

      {showMetrics && metrics && (
        <MetricsPanel metrics={metrics} onClose={() => setShowMetrics(false)} />
      )}
      {showExperiments && (
        <ExperimentSelector onClose={() => setShowExperiments(false)} />
      )}
    </div>
  )
}

function AgentInfoCard({ agentId, onClose, t }) {
  const agent = useSimulationStore(s => s.agents.find(a => a.id === agentId))
  if (!agent) return null

  const emotionItems = [
    { key: 'soledad',       value: agent.emotion.soledad,       color: '#60a5fa' },
    { key: 'sociabilidad',  value: agent.emotion.sociabilidad,  color: '#4ade80' },
    { key: 'ansiedad',      value: agent.emotion.ansiedad,      color: '#fb923c' },
    { key: 'confianza',     value: agent.emotion.confianza,     color: '#facc15' },
    { key: 'energiaSocial', value: agent.emotion.energiaSocial, color: '#a78bfa' },
  ]

  return (
    <div className="absolute top-3 left-3 right-3 sm:right-auto sm:w-60 bg-gray-900/95 border border-gray-700 rounded-2xl shadow-xl p-4 z-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: agent.color }} />
          <span className="text-white font-bold text-sm">{agent.name}</span>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-400 text-sm p-1">✕</button>
      </div>
      <div className="text-xs text-gray-500 mb-3">
        {t('personality.' + agent.personality)} · {t('state.' + agent.state)}
      </div>
      <div className="space-y-2">
        {emotionItems.map(({ key, value, color }) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">{t('emotion.' + key)}</span>
              <span className="font-mono font-bold" style={{ color }}>{Math.round(value)}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-white text-xs font-bold">{agent.history.interactions}</div>
          <div className="text-gray-600 text-xs">{t('agent.interactions')}</div>
        </div>
        <div>
          <div className="text-white text-xs font-bold">{agent.history.accepted}</div>
          <div className="text-gray-600 text-xs">{t('agent.accepted')}</div>
        </div>
        <div>
          <div className="text-white text-xs font-bold">{agent.history.rejections}</div>
          <div className="text-gray-600 text-xs">{t('agent.rejections')}</div>
        </div>
      </div>
    </div>
  )
}
