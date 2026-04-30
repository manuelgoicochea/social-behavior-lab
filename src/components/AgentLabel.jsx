import { Html } from '@react-three/drei'
import { useT } from '../i18n/useT.js'

const STATE_COLORS = {
  idle: '#9ca3af',
  seeking: '#60a5fa',
  approaching: '#34d399',
  interacting: '#4ade80',
  avoiding: '#fb923c',
  recovering: '#a78bfa',
  rejected: '#f87171',
}

export default function AgentLabel({ name, state }) {
  const t = useT()
  const color = STATE_COLORS[state] || STATE_COLORS.idle
  const label = t('state.' + state)

  return (
    <Html
      center
      position={[0, 1.6, 0]}
      className="agent-label"
      style={{ pointerEvents: 'none' }}
      zIndexRange={[10, 0]}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          color: '#f9fafb',
          fontSize: '11px',
          fontWeight: '600',
          padding: '2px 7px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, system-ui, sans-serif',
          letterSpacing: '0.02em',
        }}>
          {name}
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          color,
          fontSize: '9px',
          fontWeight: '500',
          padding: '1px 6px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, system-ui, sans-serif',
          border: `1px solid ${color}40`,
        }}>
          {label}
        </div>
      </div>
    </Html>
  )
}
