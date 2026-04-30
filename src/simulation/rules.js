const ROOM_SIZE = 7 // radio máximo de la sala

function dist(a, b) {
  const dx = a.position[0] - b.position[0]
  const dz = a.position[2] - b.position[2]
  return Math.sqrt(dx * dx + dz * dz)
}

function agentsNearby(agent, allAgents, radius = 3) {
  return allAgents.filter(other => other.id !== agent.id && dist(agent, other) < radius)
}

function randomPositionInRoom() {
  const angle = Math.random() * Math.PI * 2
  const r = Math.random() * ROOM_SIZE
  return [Math.cos(angle) * r, 0, Math.sin(angle) * r]
}

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v))
}

// Decide qué hará el agente en este tick
export function evaluateAgent(agent, allAgents) {
  const { emotion, state, history } = agent
  const nearby = agentsNearby(agent, allAgents, 3)
  const changes = {}

  // Prioridad 1: recuperarse si energía muy baja
  if (emotion.energiaSocial < 20) {
    return { newState: 'recovering', targetPosition: randomPositionInRoom(), emotionDelta: {} }
  }

  // Prioridad 2: si está recovering, esperar
  if (state === 'recovering') {
    const recovered = emotion.energiaSocial > 50
    if (recovered) {
      return { newState: 'idle', targetPosition: null, emotionDelta: {} }
    }
    return { newState: 'recovering', targetPosition: agent.targetPosition, emotionDelta: {} }
  }

  // Prioridad 3: evitar grupo grande si muy ansioso
  if (emotion.ansiedad > 70 && nearby.length > 2) {
    return {
      newState: 'avoiding',
      targetPosition: randomPositionInRoom(),
      emotionDelta: {},
    }
  }

  // Prioridad 4: buscar interacción
  const wantsSocial =
    (emotion.soledad > 70 && emotion.sociabilidad > 40) ||
    (emotion.sociabilidad > 70 && emotion.energiaSocial > 40)

  if (wantsSocial && state !== 'interacting' && state !== 'approaching') {
    // Buscar candidato válido
    const candidates = allAgents.filter(other => {
      if (other.id === agent.id) return false
      if (history.recentlyRejectedBy.includes(other.id) && emotion.confianza < 40) return false
      return true
    })

    if (candidates.length > 0) {
      // Preferir al más cercano
      const target = candidates.sort((a, b) => dist(agent, a) - dist(agent, b))[0]
      return {
        newState: 'seeking',
        targetId: target.id,
        targetPosition: [...target.position],
        emotionDelta: {},
      }
    }
  }

  // Prioridad 5: idle - moverse aleatoriamente de vez en cuando
  if (state === 'idle' || state === 'rejected') {
    if (Math.random() < 0.15) {
      return {
        newState: 'idle',
        targetPosition: randomPositionInRoom(),
        emotionDelta: {},
      }
    }
  }

  return { newState: state, targetPosition: agent.targetPosition, emotionDelta: {} }
}

// Evalúa si una interacción es aceptada
export function evaluateInteraction(initiator, receiver) {
  const { emotion } = receiver
  const base = emotion.sociabilidad + emotion.confianza - emotion.ansiedad + emotion.energiaSocial
  const prob = clamp(base / 300, 0, 1)
  const accepted = Math.random() < prob
  return { accepted, prob }
}

// Aplica consecuencias emocionales tras interacción aceptada
export function applyAcceptedInteraction(agentA, agentB) {
  const deltaA = {
    soledad: -15,
    confianza: +8,
    energiaSocial: -10,
    ansiedad: -5,
  }
  const deltaB = {
    soledad: -10,
    confianza: +6,
    energiaSocial: -8,
    ansiedad: -5,
  }
  return { deltaA, deltaB }
}

// Aplica consecuencias emocionales tras rechazo
export function applyRejection(initiator, receiver) {
  const deltaInitiator = {
    ansiedad: +12,
    confianza: -10,
    soledad: +5,
  }
  const deltaReceiver = {
    energiaSocial: -3,
  }
  return { deltaInitiator, deltaReceiver }
}

// Actualiza emociones pasivas en cada tick (soledad sube lentamente si solo)
export function passiveEmotionUpdate(agent, allAgents) {
  const nearby = agentsNearby(agent, allAgents, 4)
  const delta = {}

  if (agent.state === 'recovering') {
    delta.energiaSocial = +4
    delta.ansiedad = -2
  } else if (nearby.length === 0) {
    delta.soledad = +1.5
  }

  if (agent.state === 'interacting') {
    delta.energiaSocial = -2
    delta.soledad = -2
  }

  return delta
}

export { dist, agentsNearby, clamp }
