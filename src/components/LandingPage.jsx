import { useSimulationStore } from '../store/simulationStore.js'
import { useT, useLanguage } from '../i18n/useT.js'

export default function LandingPage() {
  const setView = useSimulationStore(s => s.setView)
  const t = useT()
  const { language, setLanguage } = useLanguage()

  const steps = [
    { icon: '🧬', title: t('landing.step1.title'), desc: t('landing.step1.desc') },
    { icon: '▶',  title: t('landing.step2.title'), desc: t('landing.step2.desc') },
    { icon: '📊', title: t('landing.step3.title'), desc: t('landing.step3.desc') },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Language toggle */}
      <div className="flex justify-end px-6 pt-4">
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {['es', 'en'].map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all uppercase ${
                language === lang
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-950/30 rounded-full blur-3xl" />
        </div>

        <div className="relative mb-6 inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-700/40 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          {t('landing.badge')}
        </div>

        <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl">
          {t('landing.title1')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-indigo-400">
            {t('landing.title2')}
          </span>
        </h1>

        <p className="relative text-gray-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          {t('landing.subtitle')}
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setView('simulation')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 hover:-translate-y-0.5"
          >
            {t('landing.cta.primary')}
          </button>
          <button
            onClick={() => setView('editor')}
            className="px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 hover:border-gray-600 text-white font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            {t('landing.cta.secondary')}
          </button>
        </div>
      </div>

      {/* 3 pasos */}
      <div className="bg-gray-900/50 border-t border-gray-800 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-100 mb-12">
            {t('landing.howItWorks')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors"
              >
                <div className="w-14 h-14 flex items-center justify-center text-3xl bg-gray-800 rounded-2xl mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
                  {t('landing.step')} {i + 1}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 px-6 text-center text-gray-600 text-sm">
        {t('landing.footer')}
      </div>
    </div>
  )
}
