import { useSimulationStore } from '../store/simulationStore.js'
import { translations, interpolate } from './translations.js'

export function useT() {
  const language = useSimulationStore(s => s.language)
  const dict = translations[language] || translations.es

  return function t(key, params = {}) {
    const str = dict[key] ?? translations.es[key] ?? key
    return interpolate(str, params)
  }
}

export function useLanguage() {
  const language = useSimulationStore(s => s.language)
  const setLanguage = useSimulationStore(s => s.setLanguage)
  return { language, setLanguage }
}
