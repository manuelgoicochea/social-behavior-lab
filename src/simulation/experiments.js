import { createAgent, PERSONALITIES, PERSONALITY_KEYS } from './personalities.js'

function spread(count) {
  const positions = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const r = 4 + Math.random() * 3
    positions.push([Math.cos(angle) * r, 0, Math.sin(angle) * r])
  }
  return positions
}

export const EXPERIMENTS = [
  {
    key: 'fiesta',
    name: 'Fiesta con desconocidos',
    description: '2 extrovertidos, 1 introvertido, 1 ansioso, 1 neutral. ¿Quién conecta primero?',
    emoji: '🎉',
    agents: (() => {
      const pos = spread(5)
      return [
        createAgent('a1', 'Ana', 'extrovertido', pos[0]),
        createAgent('a2', 'Bruno', 'extrovertido', pos[1]),
        createAgent('a3', 'Carmen', 'introvertido', pos[2]),
        createAgent('a4', 'Diego', 'ansioso', pos[3]),
        createAgent('a5', 'Elena', 'neutral', pos[4]),
      ]
    })(),
  },
  {
    key: 'grupoAnsioso',
    name: 'Grupo ansioso',
    description: '3 ansiosos, 1 extrovertido, 1 solitario. Alta tensión social.',
    emoji: '😰',
    agents: (() => {
      const pos = spread(5)
      return [
        createAgent('b1', 'Lucas', 'ansioso', pos[0]),
        createAgent('b2', 'Mia', 'ansioso', pos[1]),
        createAgent('b3', 'Noel', 'ansioso', pos[2]),
        createAgent('b4', 'Omar', 'extrovertido', pos[3]),
        createAgent('b5', 'Paula', 'solitario', pos[4]),
      ]
    })(),
  },
  {
    key: 'aislado',
    name: 'Una persona aislada',
    description: '1 solitario rodeado de 4 agentes sociables. ¿Logra conectar?',
    emoji: '🧍',
    agents: (() => {
      const pos = spread(5)
      return [
        createAgent('c1', 'Sofía', 'solitario', pos[0]),
        createAgent('c2', 'Tomás', 'neutral', pos[1]),
        createAgent('c3', 'Valeria', 'neutral', pos[2]),
        createAgent('c4', 'Willi', 'extrovertido', pos[3]),
        createAgent('c5', 'Xara', 'introvertido', pos[4]),
      ]
    })(),
  },
  {
    key: 'extrovertidos',
    name: 'Todos extrovertidos',
    description: '5 extrovertidos en la misma sala. Caos social garantizado.',
    emoji: '🥳',
    agents: (() => {
      const pos = spread(5)
      const names = ['Yael', 'Zoe', 'Alex', 'Bea', 'Ciro']
      return names.map((name, i) => createAgent(`d${i + 1}`, name, 'extrovertido', pos[i]))
    })(),
  },
  {
    key: 'equilibrado',
    name: 'Grupo equilibrado',
    description: 'Una personalidad de cada tipo. Observa el balance natural.',
    emoji: '⚖️',
    agents: (() => {
      const pos = spread(5)
      const entries = [
        ['Dana', 'extrovertido'],
        ['Eli', 'introvertido'],
        ['Fran', 'ansioso'],
        ['Gael', 'solitario'],
        ['Hana', 'neutral'],
      ]
      return entries.map(([name, personality], i) =>
        createAgent(`e${i + 1}`, name, personality, pos[i])
      )
    })(),
  },
]

export const DEFAULT_EXPERIMENT = EXPERIMENTS[0]

export function generateRandomExperiment() {
  const count = 4 + Math.floor(Math.random() * 3) // 4-6 agentes
  const pos = spread(count)
  const names = ['Alba', 'Blas', 'Celia', 'Dani', 'Eva', 'Félix']
  const agents = Array.from({ length: count }, (_, i) => {
    const personality = PERSONALITY_KEYS[Math.floor(Math.random() * PERSONALITY_KEYS.length)]
    return createAgent(`r${i}${Date.now()}`, names[i], personality, pos[i])
  })
  return {
    key: 'random',
    name: 'Experimento aleatorio',
    description: 'Combinación aleatoria de personalidades.',
    emoji: '🎲',
    agents,
  }
}
