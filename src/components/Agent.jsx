import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import AgentLabel from './AgentLabel.jsx'

const EMOTION_COLORS = {
  interacting: '#4ade80',
  seeking: '#60a5fa',
  approaching: '#34d399',
  idle: '#facc15',
  avoiding: '#fb923c',
  recovering: '#a78bfa',
  rejected: '#f87171',
}

const LERP_SPEED = 0.08

export default function Agent({ agent, onClick }) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const headRef = useRef()
  const visualPos = useRef(new THREE.Vector3(...agent.position))

  useFrame(() => {
    if (!groupRef.current) return

    // Lerp visual hacia la posición del store (que el engine actualiza)
    const storePos = new THREE.Vector3(...agent.position)
    visualPos.current.lerp(storePos, LERP_SPEED)
    groupRef.current.position.set(
      visualPos.current.x,
      visualPos.current.y,
      visualPos.current.z,
    )

    // Animación de cabeza pulsante según estado
    if (headRef.current) {
      const t = Date.now() * 0.001
      const pulse = agent.state === 'interacting'
        ? 1 + Math.sin(t * 4) * 0.12
        : agent.state === 'seeking' || agent.state === 'approaching'
          ? 1 + Math.sin(t * 2) * 0.06
          : 1
      headRef.current.scale.setScalar(pulse)
    }
  })

  const bodyColor = agent.color
  const emotionColor = EMOTION_COLORS[agent.state] || EMOTION_COLORS.idle

  return (
    <group ref={groupRef} position={agent.position} onClick={(e) => { e.stopPropagation(); onClick?.(agent) }}>
      {/* Cuerpo — cilindro */}
      <mesh ref={bodyRef} position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 1.0, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Cabeza — esfera con color emocional */}
      <mesh ref={headRef} position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.32, 12, 12]} />
        <meshStandardMaterial
          color={emotionColor}
          roughness={0.3}
          metalness={0.2}
          emissive={emotionColor}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Aura / halo sutil */}
      <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.6, 16]} />
        <meshBasicMaterial color={emotionColor} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* Label flotante */}
      <AgentLabel name={agent.name} state={agent.state} />
    </group>
  )
}
