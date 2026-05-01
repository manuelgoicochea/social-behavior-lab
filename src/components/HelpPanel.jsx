import { useT } from '../i18n/useT.js'

const PLAYBACK_ITEMS = [
  { label: 'help.btn.start.label',     desc: 'help.btn.start.desc' },
  { label: 'help.btn.pause.label',     desc: 'help.btn.pause.desc' },
  { label: 'help.btn.restart.label',   desc: 'help.btn.restart.desc' },
  { label: 'help.btn.replay.label',    desc: 'help.btn.replay.desc' },
  { label: 'help.btn.stopreplay.label',desc: 'help.btn.stopreplay.desc' },
]

const TOOL_ITEMS = [
  { label: 'help.btn.metrics.label',   desc: 'help.btn.metrics.desc' },
  { label: 'help.btn.editor.label',    desc: 'help.btn.editor.desc' },
  { label: 'help.btn.scenarios.label', desc: 'help.btn.scenarios.desc' },
]

export default function HelpPanel({ onClose }) {
  const t = useT()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[88vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-700 rounded-full sm:hidden" />
          <h2 className="text-base sm:text-lg font-bold text-white mt-1 sm:mt-0">
            {t('help.title')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all mt-1 sm:mt-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4 space-y-5">

          {/* Playback section */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {t('help.section.playback')}
            </p>
            <div className="space-y-2">
              {PLAYBACK_ITEMS.map(item => (
                <HelpRow key={item.label} label={t(item.label)} desc={t(item.desc)} />
              ))}
            </div>
          </section>

          {/* Speed section */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {t('help.section.speed')}
            </p>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 flex items-start gap-3">
              <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                {['x0.5', 'x1', 'x2', 'x4'].map(s => (
                  <span
                    key={s}
                    className="px-1.5 py-0.5 text-xs font-bold bg-gray-700 text-gray-300 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{t('help.speed.desc')}</p>
            </div>
          </section>

          {/* Tools section */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {t('help.section.tools')}
            </p>
            <div className="space-y-2">
              {TOOL_ITEMS.map(item => (
                <HelpRow key={item.label} label={t(item.label)} desc={t(item.desc)} />
              ))}
            </div>
          </section>

          {/* Tip */}
          <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl px-4 py-3">
            <p className="text-sm text-indigo-300 leading-relaxed">{t('help.tip')}</p>
          </div>

          <div className="h-2" />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-5 pt-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-sm"
          >
            {t('help.close')}
          </button>
        </div>
      </div>
    </div>
  )
}

function HelpRow({ label, desc }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 flex items-start gap-3">
      <code className="text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 rounded-lg px-2 py-1.5 flex-shrink-0 leading-tight whitespace-nowrap mt-0.5">
        {label}
      </code>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
