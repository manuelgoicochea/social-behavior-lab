export const PERSONALITIES = {
  extrovertido: {
    key: 'extrovertido',
    label: 'Extrovertido',
    color: '#f59e0b',
    emotion: {
      soledad: 40,
      sociabilidad: 90,
      ansiedad: 20,
      confianza: 80,
      energiaSocial: 90,
    },
    description: 'Busca interacción constantemente, tolera rechazos y se recupera rápido.',
  },
  introvertido: {
    key: 'introvertido',
    label: 'Introvertido',
    color: '#6366f1',
    emotion: {
      soledad: 45,
      sociabilidad: 35,
      ansiedad: 55,
      confianza: 50,
      energiaSocial: 45,
    },
    description: 'Puede interactuar pero se cansa socialmente más rápido. Prefiere grupos pequeños.',
  },
  ansioso: {
    key: 'ansioso',
    label: 'Ansioso',
    color: '#ef4444',
    emotion: {
      soledad: 60,
      sociabilidad: 45,
      ansiedad: 85,
      confianza: 35,
      energiaSocial: 40,
    },
    description: 'Quiere interactuar pero duda. Evita grupos y le afectan más los rechazos.',
  },
  solitario: {
    key: 'solitario',
    label: 'Solitario',
    color: '#8b5cf6',
    emotion: {
      soledad: 80,
      sociabilidad: 25,
      ansiedad: 65,
      confianza: 25,
      energiaSocial: 35,
    },
    description: 'Alta necesidad de conexión pero baja probabilidad de iniciar. Se aísla tras rechazos.',
  },
  neutral: {
    key: 'neutral',
    label: 'Neutral',
    color: '#10b981',
    emotion: {
      soledad: 50,
      sociabilidad: 50,
      ansiedad: 50,
      confianza: 50,
      energiaSocial: 50,
    },
    description: 'Balanceado. Acepta o rechaza según el contexto.',
  },
}

export const PERSONALITY_KEYS = Object.keys(PERSONALITIES)

export function createAgent(id, name, personality, position, color) {
  const p = PERSONALITIES[personality]
  return {
    id,
    name,
    color: color || p.color,
    personality,
    position: position || [
      (Math.random() - 0.5) * 14,
      0,
      (Math.random() - 0.5) * 14,
    ],
    targetPosition: null,
    state: 'idle',
    emotion: { ...p.emotion },
    baseEmotion: { ...p.emotion },
    history: {
      interactions: 0,
      rejections: 0,
      accepted: 0,
      recentlyRejectedBy: [],
      interactionWith: {},
    },
  }
}
