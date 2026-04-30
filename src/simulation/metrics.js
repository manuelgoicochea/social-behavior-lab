import { translations, interpolate } from '../i18n/translations.js'

export function calculateMetrics(agents, events, language = 'es') {
  const t = (key, params) => {
    const dict = translations[language] || translations.es
    const str = dict[key] ?? translations.es[key] ?? key
    return interpolate(str, params)
  }

  const interactionEvents = events.filter(e => e.type === 'interaction_accepted')
  const rejectionEvents = events.filter(e => e.type === 'interaction_rejected')

  const socialCounts = {}
  interactionEvents.forEach(e => {
    socialCounts[e.agentId] = (socialCounts[e.agentId] || 0) + 1
    socialCounts[e.targetId] = (socialCounts[e.targetId] || 0) + 1
  })

  const mostSocial = agents.reduce((best, a) =>
    (socialCounts[a.id] || 0) > (socialCounts[best?.id] || 0) ? a : best, agents[0])

  const mostIsolated = agents.reduce((worst, a) =>
    (socialCounts[a.id] || 0) < (socialCounts[worst?.id] || 0) ? a : worst, agents[0])

  const mostAnxious = agents.reduce((max, a) =>
    a.emotion.ansiedad > (max?.emotion?.ansiedad || 0) ? a : max, agents[0])

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

  const durationEvents = events.filter(e => e.type === 'interaction_end')
  const avgDuration = durationEvents.length > 0
    ? Math.round(durationEvents.reduce((s, e) => s + (e.duration || 0), 0) / durationEvents.length)
    : 0

  const narrative = generateNarrative(t, language, {
    agents, mostSocial, mostIsolated, mostAnxious, bestPair,
    interactionCount: interactionEvents.length,
    rejectionCount: rejectionEvents.length,
    socialCounts,
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

function plural(count, lang) {
  if (lang === 'en') return count !== 1 ? 's' : ''
  return count !== 1 ? 'es' : ''
}

function generateNarrative(t, lang, { mostSocial, mostIsolated, mostAnxious, bestPair, interactionCount, rejectionCount, socialCounts }) {
  if (interactionCount === 0) return t('narrative.noInteractions')

  let text = ''

  if (mostSocial) {
    const count = socialCounts[mostSocial.id] || 0
    text += t('narrative.mostSocial', { name: mostSocial.name, count, plural: plural(count, lang) }) + ' '
  }

  if (mostIsolated && mostIsolated.id !== mostSocial?.id) {
    const isoCount = socialCounts[mostIsolated.id] || 0
    if (isoCount === 0) {
      text += t('narrative.isolated', { name: mostIsolated.name }) + ' '
    } else {
      text += t('narrative.lowActivity', { name: mostIsolated.name, count: isoCount, plural: plural(isoCount, lang) }) + ' '
    }
  }

  if (rejectionCount > 0) {
    text += t('narrative.rejections', { count: rejectionCount, plural: plural(rejectionCount, lang) }) + ' '
  }

  if (bestPair) {
    text += t('narrative.bestPair', { nameA: bestPair.agentA.name, nameB: bestPair.agentB.name, count: bestPair.count }) + ' '
  }

  if (mostAnxious) {
    text += t('narrative.anxiety', { name: mostAnxious.name, value: Math.round(mostAnxious.emotion.ansiedad) })
  }

  return text.trim() || t('narrative.fallback')
}
