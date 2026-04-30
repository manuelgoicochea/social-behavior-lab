import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TYPE_COLORS = {
  positive: '#4ade80',
  rejection: '#f87171',
  avoiding: '#6b7280',
  bond: '#60a5fa',
}

export default function InteractionLine({ interaction, agents }) {
  const lineRef = useRef()

  const agentA = agents.find(a => a.id === interaction.agentAId)
  const agentB = agents.find(a => a.id === interaction.agentBId)

  useFrame(() => {
    if (!lineRef.current || !agentA || !agentB) return
    const posA = new THREE.Vector3(...agentA.position)
    const posB = new THREE.Vector3(...agentB.position)
    posA.y = 0.8
    posB.y = 0.8
    lineRef.current.geometry.setFromPoints([posA, posB])
  })

  if (!agentA || !agentB) return null

  const color = TYPE_COLORS[interaction.type] || TYPE_COLORS.positive
  const posA = new THREE.Vector3(...agentA.position)
  const posB = new THREE.Vector3(...agentB.position)
  posA.y = 0.8
  posB.y = 0.8

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array([posA.x, posA.y, posA.z, posB.x, posB.y, posB.z]), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} linewidth={2} transparent opacity={0.8} />
    </line>
  )
}
