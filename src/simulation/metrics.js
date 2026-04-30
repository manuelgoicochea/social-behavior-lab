export function calculateMetrics(agents, events) {
  const interactionEvents = events.filter(e => e.type === 'interaction_accepted')
  const rejectionEvents = events.filter(e => e.type === 'interaction_rejected')

  // Agente más social
  const socialCounts = {}
  interactionEvents.forEach(e => {
    socialCounts[e.agentId] = (socialCounts[e.agentId] || 0) + 1
    socialCounts[e.targetId] = (socialCounts[e.targetId] || 0) + 1
  })

  const mostSocial = agents.reduce((best, a) => {
    return (socialCounts[a.id] || 0) > (socialCounts[best?.id] || 0) ? a : best
  }, agents[0])

  // Agente más aislado
  const mostIsolated = agents.reduce((worst, a) => {
    return (socialCounts[a.id] || 0) < (socialCounts[worst?.id] || 0) ? a : worst
  }, agents[0])

  // Agente con mayor ansiedad final
  const mostAnxious = agents.reduce((max, a) => {
    return a.emotion.ansiedad > (max?.emotion?.ansiedad || 0) ? a : max
  }, agents[0])

  // Pareja con mejor vínculo
  const pairCounts = {}
  interactionEvents.forEach(e => {
    const key = [e.agentId, e.targetId].sort().join('-')
    pairCounts[key] = (pairCounts[key] || 0) + 1
  })

  let bestPair = null
  let bestPairCount = 0
  Object.entries(pairCounts).forEach(([key, count]) => {
    if (count > bestPairCount) {
      bestPairCount = count
      const [idA, idB] = key.split('-')
      const agentA = agents.find(a => a.id === idA)
      const agentB = agents.find(a => a.id === idB)
      if (agentA && agentB) bestPair = { agentA, agentB, count }
    }
  })

  // Tiempo promedio de interacción (en ticks)
  const durationEvents = events.filter(e => e.type === 'interaction_end')
  const avgDuration = durationEvents.length > 0
    ? Math.round(durationEvents.reduce((s, e) => s + (e.duration || 0), 0) / durationEvents.length)
    : 0

  // Generar resumen narrativo
  const narrative = generateNarrative({
    agents,
    mostSocial,
    mostIsolated,
    mostAnxious,
    bestPair,
    interactionCount: interactionEvents.length,
    rejectionCount: rejectionEvents.length,
    socialCounts,
    pairCounts,
  })

  return {
    totalInteractions: interactionEvents.length,
    totalRejections: rejectionEvents.length,
    avgInteractionDuration: avgDuration,
    mostSocial,
    mostIsolated,
    mostAnxious,
    bestPair,
    narrative,
  }
}

function generateNarrative({ agents, mostSocial, mostIsolated, mostAnxious, bestPair, interactionCount, rejectionCount, socialCounts }) {
  if (interactionCount === 0) {
    return 'La simulación terminó sin que ningún agente lograra establecer una interacción. La ansiedad o el aislamiento fue demasiado alto para iniciarse.'
  }

  let text = ''

  if (mostSocial) {
    const count = socialCounts[mostSocial.id] || 0
    text += `${mostSocial.name} fue el agente más social, participando en ${count} interacción${count !== 1 ? 'es' : ''}. `
  }

  if (mostIsolated && mostIsolated.id !== mostSocial?.id) {
    const isoCount = socialCounts[mostIsolated.id] || 0
    if (isoCount === 0) {
      text += `${mostIsolated.name} terminó completamente aislado, sin lograr ninguna interacción. `
    } else {
      text += `${mostIsolated.name} tuvo muy poca actividad social (${isoCount} interacción${isoCount !== 1 ? 'es' : ''}). `
    }
  }

  if (rejectionCount > 0) {
    text += `Se registraron ${rejectionCount} rechazo${rejectionCount !== 1 ? 's' : ''}, lo que elevó los niveles de ansiedad en el grupo. `
  }

  if (bestPair) {
    text += `La pareja con mayor vínculo fue ${bestPair.agentA.name} y ${bestPair.agentB.name}, quienes interactuaron ${bestPair.count} veces. `
  }

  if (mostAnxious) {
    const anx = Math.round(mostAnxious.emotion.ansiedad)
    text += `Al finalizar, ${mostAnxious.name} presentó la mayor ansiedad (${anx}/100).`
  }

  return text || 'La simulación mostró dinámicas sociales complejas entre los agentes.'
}
