import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useSimulationStore } from '../store/simulationStore.js'
import Agent from './Agent.jsx'
import InteractionLine from './InteractionLine.jsx'

function Room() {
  const wallMat = <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.1} transparent opacity={0.7} />
  const wallH = 2.5
  const wallL = 16
  const thickness = 0.3

  return (
    <group>
      {/* Piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Grid sobre el piso */}
      <Grid
        args={[16, 16]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#1e3a5f"
        sectionSize={4}
        sectionThickness={0.8}
        sectionColor="#1e40af"
        fadeDistance={30}
        fadeStrength={1}
        position={[0, 0.001, 0]}
      />

      {/* Pared norte */}
      <mesh position={[0, wallH / 2, -8]}>
        <boxGeometry args={[wallL, wallH, thickness]} />
        {wallMat}
      </mesh>
      {/* Pared sur */}
      <mesh position={[0, wallH / 2, 8]}>
        <boxGeometry args={[wallL, wallH, thickness]} />
        {wallMat}
      </mesh>
      {/* Pared oeste */}
      <mesh position={[-8, wallH / 2, 0]}>
        <boxGeometry args={[thickness, wallH, wallL]} />
        {wallMat}
      </mesh>
      {/* Pared este */}
      <mesh position={[8, wallH / 2, 0]}>
        <boxGeometry args={[thickness, wallH, wallL]} />
        {wallMat}
      </mesh>
    </group>
  )
}

export default function SimulationCanvas({ onAgentClick }) {
  const agents = useSimulationStore(s => s.agents)
  const activeInteractions = useSimulationStore(s => s.activeInteractions)

  return (
    <Canvas
      shadows
      camera={{ position: [18, 18, 18], fov: 45 }}
      gl={{ antialias: true }}
      style={{ background: '#030712' }}
    >
      {/* Luces */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#4338ca" />

      {/* Sala */}
      <Room />

      {/* Líneas de interacción */}
      {activeInteractions.map(interaction => (
        <InteractionLine
          key={interaction.id}
          interaction={interaction}
          agents={agents}
        />
      ))}

      {/* Agentes */}
      {agents.map(agent => (
        <Agent
          key={agent.id}
          agent={agent}
          onClick={onAgentClick}
        />
      ))}

      {/* Controles de cámara (solo orbitar, sin pan complejo) */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={40}
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}
