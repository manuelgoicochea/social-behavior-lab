import {
  evaluateAgent,
  evaluateInteraction,
  applyAcceptedInteraction,
  applyRejection,
  passiveEmotionUpdate,
  dist,
  clamp,
} from './rules.js'
import { calculateMetrics } from './metrics.js'

const TICK_BASE_MS = 1000
const INTERACTION_RADIUS = 2.2
const INTERACTION_DURATION_TICKS = 4
const REJECTION_MEMORY_TICKS = 20
const MOVE_SPEED = 0.8 // unidades por tick

// Agentes que están actualmente interactuando juntos
const activeInteractionPairs = new Map() // "id1-id2" => ticksRemaining

let intervalId = null
let store = null

export function initEngine(zustandStore) {
  store = zustandStore
}

export function startEngine() {
  stopEngine()
  const { speed } = store.getState()
  scheduleNext(speed)
}

export function stopEngine() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
  activeInteractionPairs.clear()
}

function scheduleNext(speed) {
  if (intervalId !== null) clearInterval(intervalId)
  const ms = TICK_BASE_MS / speed
  intervalId = setInterval(tick, ms)
}

export function updateSpeed(speed) {
  scheduleNext(speed)
}

function tick() {
  const state = store.getState()
  if (state.status !== 'running') return

  const agents = state.agents
  const currentTick = state.tick

  // 1. Actualizar pares de interacción activos
  for (const [key, data] of activeInteractionPairs.entries()) {
    data.ticksRemaining -= 1
    if (data.ticksRemaining <= 0) {
      activeInteractionPairs.delete(key)
      // Emitir fin de interacción
      store.getState().addEvent({
        type: 'interaction_end',
        message: `${data.nameA} y ${data.nameB} terminaron de hablar.`,
        agentId: data.idA,
        targetId: data.idB,
        duration: INTERACTION_DURATION_TICKS,
        color: 'gray',
      })
      // Volver a idle
      store.getState().updateAgent(data.idA, { state: 'idle', targetPosition: null })
      store.getState().updateAgent(data.idB, { state: 'idle', targetPosition: null })
    }
  }

  // 2. Limpiar interacciones visuales antiguas
  store.getState().clearOldInteractions(currentTick)

  // 3. Limpiar memoria de rechazos antiguos
  const updatedAgents = agents.map(agent => {
    const filtered = (agent.history.recentlyRejectedBy || []).filter(entry => {
      return (currentTick - (entry.tick || 0)) < REJECTION_MEMORY_TICKS
    })
    if (filtered.length !== agent.history.recentlyRejectedBy.length) {
      return { ...agent, history: { ...agent.history, recentlyRejectedBy: filtered } }
    }
    return agent
  })

  // 4. Evaluar y actualizar cada agente
  updatedAgents.forEach(agent => {
    // Si está en una interacción activa, no evaluar
    const isInteracting = [...activeInteractionPairs.keys()].some(k => k.includes(agent.id))
    if (isInteracting) return

    const result = evaluateAgent(agent, updatedAgents)

    // Calcular delta emocional pasivo
    const passiveDelta = passiveEmotionUpdate(agent, updatedAgents)

    // Aplicar deltas emocionales
    const newEmotion = applyEmotionDelta(agent.emotion, { ...result.emotionDelta, ...passiveDelta })

    const updates = {
      state: result.newState,
      emotion: newEmotion,
    }

    if (result.targetPosition) updates.targetPosition = result.targetPosition
    if (result.targetId) updates.targetId = result.targetId

    store.getState().updateAgent(agent.id, updates)
  })

  // 5. Mover agentes hacia su targetPosition (actualiza position en store)
  store.getState().agents.forEach(agent => {
    if (agent.state === 'interacting' || agent.state === 'recovering') return

    // Si tiene targetId, actualizar targetPosition al target actual
    let effectiveTarget = agent.targetPosition
    if (agent.targetId) {
      const targetAgent = store.getState().agents.find(a => a.id === agent.targetId)
      if (targetAgent) {
        effectiveTarget = [...targetAgent.position]
        // Actualizar state a approaching cuando se mueve hacia alguien
        if (agent.state === 'seeking') {
          store.getState().updateAgent(agent.id, { state: 'approaching', targetPosition: effectiveTarget })
        } else {
          store.getState().updateAgent(agent.id, { targetPosition: effectiveTarget })
        }
      }
    }

    if (!effectiveTarget) return

    const newPos = stepToward(agent.position, effectiveTarget, MOVE_SPEED)
    const arrived = dist({ position: newPos }, { position: effectiveTarget }) < 0.5
    store.getState().updateAgent(agent.id, {
      position: newPos,
      ...(arrived && !agent.targetId ? { targetPosition: null } : {}),
    })
  })

  // 6. Re-leer agentes actualizados para evaluar interacciones
  const currentAgents = store.getState().agents

  // 6. Evaluar interacciones por proximidad
  for (let i = 0; i < currentAgents.length; i++) {
    const agentA = currentAgents[i]
    if (agentA.state !== 'seeking' && agentA.state !== 'approaching') continue

    for (let j = i + 1; j < currentAgents.length; j++) {
      const agentB = currentAgents[j]
      const pairKey = [agentA.id, agentB.id].sort().join('-')
      if (activeInteractionPairs.has(pairKey)) continue

      const distance = dist(agentA, agentB)
      if (distance < INTERACTION_RADIUS) {
        // Evaluar si B acepta
        const { accepted } = evaluateInteraction(agentA, agentB)

        if (accepted) {
          // Interacción aceptada
          const { deltaA, deltaB } = applyAcceptedInteraction(agentA, agentB)

          activeInteractionPairs.set(pairKey, {
            ticksRemaining: INTERACTION_DURATION_TICKS,
            idA: agentA.id,
            idB: agentB.id,
            nameA: agentA.name,
            nameB: agentB.name,
          })

          store.getState().updateAgent(agentA.id, {
            state: 'interacting',
            targetPosition: null,
            targetId: null,
            emotion: applyEmotionDelta(agentA.emotion, deltaA),
            history: {
              ...agentA.history,
              interactions: agentA.history.interactions + 1,
              accepted: agentA.history.accepted + 1,
            },
          })

          store.getState().updateAgent(agentB.id, {
            state: 'interacting',
            targetPosition: null,
            targetId: null,
            emotion: applyEmotionDelta(agentB.emotion, deltaB),
            history: {
              ...agentB.history,
              interactions: agentB.history.interactions + 1,
              accepted: agentB.history.accepted + 1,
            },
          })

          store.getState().addEvent({
            type: 'interaction_accepted',
            message: `${agentA.name} y ${agentB.name} empezaron a hablar. La confianza de ambos aumentó.`,
            agentId: agentA.id,
            targetId: agentB.id,
            color: 'green',
          })

          store.getState().addInteraction({
            agentAId: agentA.id,
            agentBId: agentB.id,
            posA: [...agentA.position],
            posB: [...agentB.position],
            type: 'positive',
          })

        } else {
          // Rechazo
          const { deltaInitiator, deltaReceiver } = applyRejection(agentA, agentB)

          const rejectEntry = { id: agentB.id, tick: currentTick }
          const newRejectedBy = [...(agentA.history.recentlyRejectedBy || []), rejectEntry]

          store.getState().updateAgent(agentA.id, {
            state: 'rejected',
            targetId: null,
            targetPosition: null,
            emotion: applyEmotionDelta(agentA.emotion, deltaInitiator),
            history: {
              ...agentA.history,
              rejections: agentA.history.rejections + 1,
              recentlyRejectedBy: newRejectedBy,
            },
          })

          store.getState().updateAgent(agentB.id, {
            state: 'avoiding',
            targetPosition: getOppositePosition(agentB.position, agentA.position),
            emotion: applyEmotionDelta(agentB.emotion, deltaReceiver),
          })

          store.getState().addEvent({
            type: 'interaction_rejected',
            message: `${agentB.name} rechazó a ${agentA.name}. La ansiedad de ${agentA.name} aumentó.`,
            agentId: agentA.id,
            targetId: agentB.id,
            color: 'red',
          })

          store.getState().addInteraction({
            agentAId: agentA.id,
            agentBId: agentB.id,
            posA: [...agentA.position],
            posB: [...agentB.position],
            type: 'rejection',
          })
        }
      }
    }
  }

  // 7. Capturar frame y avanzar tick
  store.getState().captureFrame()
  store.getState().incrementTick()
}

function stepToward(current, target, speed) {
  const dx = target[0] - current[0]
  const dz = target[2] - current[2]
  const len = Math.sqrt(dx * dx + dz * dz)
  if (len <= speed) return [target[0], 0, target[2]]
  return [
    current[0] + (dx / len) * speed,
    0,
    current[2] + (dz / len) * speed,
  ]
}

function applyEmotionDelta(emotion, delta) {
  const result = { ...emotion }
  Object.keys(delta).forEach(key => {
    if (result[key] !== undefined) {
      result[key] = clamp(result[key] + delta[key])
    }
  })
  return result
}

function getOppositePosition(fromPos, toPos, distance = 5) {
  const dx = fromPos[0] - toPos[0]
  const dz = fromPos[2] - toPos[2]
  const len = Math.sqrt(dx * dx + dz * dz) || 1
  const nx = dx / len
  const nz = dz / len
  return [
    Math.max(-7, Math.min(7, fromPos[0] + nx * distance)),
    0,
    Math.max(-7, Math.min(7, fromPos[2] + nz * distance)),
  ]
}

export function computeFinalMetrics() {
  const { agents, events } = store.getState()
  return calculateMetrics(agents, events)
}
