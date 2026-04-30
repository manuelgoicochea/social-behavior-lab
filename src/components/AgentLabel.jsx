import { Html } from '@react-three/drei'

const STATE_LABELS = {
  idle: { text: 'Quieto', color: '#9ca3af' },
  seeking: { text: 'Buscando compañía', color: '#60a5fa' },
  approaching: { text: 'Acercándose', color: '#34d399' },
  interacting: { text: 'Hablando', color: '#4ade80' },
  avoiding: { text: 'Evitando', color: '#fb923c' },
  recovering: { text: 'Recuperándose', color: '#a78bfa' },
  rejected: { text: 'Rechazado', color: '#f87171' },
}

export default function AgentLabel({ name, state }) {
  const info = STATE_LABELS[state] || STATE_LABELS.idle

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
          color: info.color,
          fontSize: '9px',
          fontWeight: '500',
          padding: '1px 6px',
          borderRadius: '999px',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, system-ui, sans-serif',
          border: `1px solid ${info.color}40`,
        }}>
          {info.text}
        </div>
      </div>
    </Html>
  )
}
