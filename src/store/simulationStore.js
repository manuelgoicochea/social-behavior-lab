import { create } from 'zustand'
import { DEFAULT_EXPERIMENT } from '../simulation/experiments.js'

const MAX_EVENTS = 200
const MAX_FRAMES = 3000

export const useSimulationStore = create((set, get) => ({
  // Idioma
  language: 'es', // 'es' | 'en'
  setLanguage: (language) => set({ language }),

  // Vista actual
  currentView: 'landing', // 'landing' | 'simulation' | 'editor'
  setView: (view) => set({ currentView: view }),

  // Estado de simulación
  status: 'idle', // 'idle' | 'running' | 'paused' | 'replay'
  speed: 1,
  tick: 0,
  experimentName: DEFAULT_EXPERIMENT.name,

  // Agentes
  agents: DEFAULT_EXPERIMENT.agents,

  // Interacciones activas (líneas temporales)
  activeInteractions: [],

  // Log de eventos
  events: [],

  // Frames para replay
  replayFrames: [],
  replayTick: 0,

  // Métricas
  metrics: null,

  // Acciones de vista
  setStatus: (status) => set({ status }),
  setSpeed: (speed) => set({ speed }),

  // Iniciar simulación
  startSimulation: () => set({
    status: 'running',
    tick: 0,
    events: [],
    replayFrames: [],
    replayTick: 0,
    metrics: null,
    activeInteractions: [],
  }),

  // Pausar / reanudar
  pauseSimulation: () => {
    const { status } = get()
    if (status === 'running') set({ status: 'paused' })
    else if (status === 'paused') set({ status: 'running' })
  },

  // Reiniciar
  resetSimulation: () => {
    const { experimentName } = get()
    // Importación dinámica no disponible aquí; el componente pasa los agentes
    set({
      status: 'idle',
      tick: 0,
      events: [],
      replayFrames: [],
      replayTick: 0,
      metrics: null,
      activeInteractions: [],
    })
  },

  // Cargar experimento
  loadExperiment: (experiment) => set({
    agents: experiment.agents.map(a => ({ ...a })),
    experimentName: experiment.name,
    status: 'idle',
    tick: 0,
    events: [],
    replayFrames: [],
    replayTick: 0,
    metrics: null,
    activeInteractions: [],
  }),

  // Actualizar agente
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  // Actualizar posición de agente (frecuente, optimizado)
  updateAgentPosition: (id, position) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, position } : a)
  })),

  // Tick de simulación
  incrementTick: () => set((state) => ({ tick: state.tick + 1 })),

  // Agregar evento
  addEvent: (event) => set((state) => {
    const events = [{ ...event, tick: state.tick, id: Date.now() + Math.random() }, ...state.events]
    return { events: events.slice(0, MAX_EVENTS) }
  }),

  // Interacciones activas (líneas)
  addInteraction: (interaction) => set((state) => ({
    activeInteractions: [...state.activeInteractions, { ...interaction, id: Date.now() + Math.random(), createdAt: state.tick }]
  })),

  removeInteraction: (id) => set((state) => ({
    activeInteractions: state.activeInteractions.filter(i => i.id !== id)
  })),

  clearOldInteractions: (currentTick) => set((state) => ({
    activeInteractions: state.activeInteractions.filter(i => currentTick - i.createdAt < 5)
  })),

  // Capturar frame para replay
  captureFrame: () => {
    const { tick, agents, events, replayFrames } = get()
    if (replayFrames.length >= MAX_FRAMES) return
    const frame = {
      tick,
      agents: agents.map(a => ({
        id: a.id,
        position: [...a.position],
        state: a.state,
        emotion: { ...a.emotion },
      })),
      lastEvent: events[0] || null,
    }
    set({ replayFrames: [...replayFrames, frame] })
  },

  // Replay
  setReplayTick: (t) => set({ replayTick: t }),

  startReplay: () => set({ status: 'replay', replayTick: 0 }),

  stopReplay: () => set({ status: 'paused' }),

  // Guardar métricas
  setMetrics: (metrics) => set({ metrics }),

  // Editar agente (desde editor)
  editAgent: (id, changes) => set((state) => ({
    agents: state.agents.map(a => a.id === id ? { ...a, ...changes } : a)
  })),

  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, agent]
  })),

  removeAgent: (id) => set((state) => ({
    agents: state.agents.filter(a => a.id !== id)
  })),
}))
