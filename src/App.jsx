import { useSimulationStore } from './store/simulationStore.js'
import LandingPage from './components/LandingPage.jsx'
import SimulationView from './components/SimulationView.jsx'
import CharacterEditor from './components/CharacterEditor.jsx'

export default function App() {
  const currentView = useSimulationStore(s => s.currentView)

  return (
    <>
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'simulation' && <SimulationView />}
      {currentView === 'editor' && <CharacterEditor />}
    </>
  )
}
