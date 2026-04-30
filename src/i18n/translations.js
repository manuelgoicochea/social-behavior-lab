export const translations = {
  es: {
    // Landing
    'landing.badge': 'Laboratorio de comportamiento social · MVP',
    'landing.title1': 'Crea personalidades y observa cómo',
    'landing.title2': 'interactúan en una simulación social 3D',
    'landing.subtitle': 'Configura agentes con ansiedad, soledad, sociabilidad y confianza. Luego mira cómo se acercan, se evitan, forman vínculos o terminan aislados.',
    'landing.cta.primary': 'Ver simulación en acción →',
    'landing.cta.secondary': 'Crear experimento',
    'landing.howItWorks': '¿Cómo funciona?',
    'landing.step': 'Paso',
    'landing.step1.title': 'Crea personajes',
    'landing.step1.desc': 'Elige nombres, colores y rasgos de personalidad como ansiedad, sociabilidad y confianza.',
    'landing.step2.title': 'Inicia la simulación',
    'landing.step2.desc': 'Los agentes toman decisiones autónomas basadas en sus emociones internas.',
    'landing.step3.title': 'Analiza resultados',
    'landing.step3.desc': 'Observa interacciones, rechazos, vínculos y aislamiento en tiempo real.',
    'landing.footer': 'Social Behavior Lab · MVP experimental',

    // Agent states
    'state.idle': 'Quieto',
    'state.seeking': 'Buscando compañía',
    'state.approaching': 'Acercándose',
    'state.interacting': 'Hablando',
    'state.avoiding': 'Evitando',
    'state.recovering': 'Recuperándose',
    'state.rejected': 'Rechazado',

    // Control panel
    'ctrl.start': 'Iniciar experimento',
    'ctrl.pause': 'Pausar',
    'ctrl.resume': 'Reanudar',
    'ctrl.restart': 'Reiniciar',
    'ctrl.metrics': 'Métricas',
    'ctrl.replay': 'Ver replay',
    'ctrl.stopReplay': 'Detener replay',
    'ctrl.editor': 'Editor',
    'ctrl.experiments': 'Escenarios',
    'ctrl.exp': 'Exp:',
    'ctrl.back': '← Inicio',

    // Events panel
    'events.title': 'Eventos',
    'events.count': '{n} eventos',
    'events.empty': 'Los eventos aparecerán aquí cuando inicies la simulación.',
    'event.interaction_accepted': '{nameA} y {nameB} empezaron a hablar. La confianza de ambos aumentó.',
    'event.interaction_rejected': '{nameB} rechazó a {nameA}. La ansiedad de {nameA} aumentó.',
    'event.interaction_end': '{nameA} y {nameB} terminaron de hablar.',

    // Metrics panel
    'metrics.title': 'Resultados del experimento',
    'metrics.subtitle': 'Resumen de la simulación',
    'metrics.interactions': 'Interacciones',
    'metrics.rejections': 'Rechazos',
    'metrics.avgDuration': 'Duración media',
    'metrics.highestAnxiety': 'Mayor ansiedad',
    'metrics.mostSocial': 'Agente más social',
    'metrics.mostIsolated': 'Agente más aislado',
    'metrics.bestBond': 'Mejor vínculo',
    'metrics.narrative': 'Resumen narrativo',
    'metrics.close': 'Cerrar',
    'metrics.times': 'veces',
    'metrics.and': 'y',

    // Metrics narrative
    'narrative.noInteractions': 'La simulación terminó sin que ningún agente lograra establecer una interacción. La ansiedad o el aislamiento fue demasiado alto para iniciarse.',
    'narrative.mostSocial': '{name} fue el agente más social, participando en {count} interacción{plural}.',
    'narrative.isolated': '{name} terminó completamente aislado, sin lograr ninguna interacción.',
    'narrative.lowActivity': '{name} tuvo muy poca actividad social ({count} interacción{plural}).',
    'narrative.rejections': 'Se registraron {count} rechazo{plural}, lo que elevó los niveles de ansiedad en el grupo.',
    'narrative.bestPair': 'La pareja con mayor vínculo fue {nameA} y {nameB}, quienes interactuaron {count} veces.',
    'narrative.anxiety': 'Al finalizar, {name} presentó la mayor ansiedad ({value}/100).',
    'narrative.fallback': 'La simulación mostró dinámicas sociales complejas entre los agentes.',

    // Character editor
    'editor.title': 'Editor de personajes',
    'editor.back': '← Inicio',
    'editor.startSim': '▶ Iniciar simulación',
    'editor.characters': 'Personajes',
    'editor.name': 'Nombre',
    'editor.color': 'Color',
    'editor.personality': 'Personalidad base',
    'editor.emotions': 'Variables emocionales',
    'editor.select': 'Selecciona un personaje para editarlo',

    // Emotion labels
    'emotion.soledad': 'Soledad',
    'emotion.sociabilidad': 'Sociabilidad',
    'emotion.ansiedad': 'Ansiedad',
    'emotion.confianza': 'Confianza',
    'emotion.energiaSocial': 'Energía social',

    // Personalities
    'personality.extrovertido': 'Extrovertido',
    'personality.introvertido': 'Introvertido',
    'personality.ansioso': 'Ansioso',
    'personality.solitario': 'Solitario',
    'personality.neutral': 'Neutral',
    'personality.desc.extrovertido': 'Busca interacción con frecuencia, tolera rechazos y se recupera rápido.',
    'personality.desc.introvertido': 'Puede interactuar pero se cansa socialmente más rápido. Prefiere grupos pequeños.',
    'personality.desc.ansioso': 'Quiere interactuar pero duda. Evita grupos y le afectan más los rechazos.',
    'personality.desc.solitario': 'Alta necesidad de conexión pero baja probabilidad de iniciar. Se aísla tras rechazos.',
    'personality.desc.neutral': 'Balanceado. Acepta o rechaza según el contexto.',

    // Experiments
    'experiments.title': 'Escenarios predefinidos',
    'experiments.subtitle': 'Elige un experimento para comenzar',
    'experiments.random.title': 'Generar escenario aleatorio',
    'experiments.random.desc': 'Combinación aleatoria de personalidades y agentes',
    'exp.fiesta.name': 'Fiesta con desconocidos',
    'exp.fiesta.desc': '2 extrovertidos, 1 introvertido, 1 ansioso, 1 neutral. ¿Quién conecta primero?',
    'exp.grupoAnsioso.name': 'Grupo ansioso',
    'exp.grupoAnsioso.desc': '3 ansiosos, 1 extrovertido, 1 solitario. Alta tensión social.',
    'exp.aislado.name': 'Una persona aislada',
    'exp.aislado.desc': '1 solitario rodeado de 4 agentes sociables. ¿Logra conectar?',
    'exp.extrovertidos.name': 'Todos extrovertidos',
    'exp.extrovertidos.desc': '5 extrovertidos en la misma sala. Caos social garantizado.',
    'exp.equilibrado.name': 'Grupo equilibrado',
    'exp.equilibrado.desc': 'Una personalidad de cada tipo. Observa el balance natural.',

    // Simulation view
    'sim.back': '← Inicio',
    'sim.ready.title': 'Simulación lista',
    'sim.ready.desc': 'Presiona {btn} para observar cómo interactúan los agentes.',
    'sim.ready.change': 'Cambiar escenario →',

    // Agent info card
    'agent.interactions': 'interacc.',
    'agent.accepted': 'aceptadas',
    'agent.rejections': 'rechazos',
  },

  en: {
    // Landing
    'landing.badge': 'Social behavior laboratory · MVP',
    'landing.title1': 'Create personalities and watch how they',
    'landing.title2': 'interact in a 3D social simulation',
    'landing.subtitle': 'Set up agents with anxiety, loneliness, sociability and confidence. Then watch how they approach, avoid, bond or end up isolated.',
    'landing.cta.primary': 'See simulation in action →',
    'landing.cta.secondary': 'Create experiment',
    'landing.howItWorks': 'How does it work?',
    'landing.step': 'Step',
    'landing.step1.title': 'Create characters',
    'landing.step1.desc': 'Choose names, colors and personality traits like anxiety, sociability and confidence.',
    'landing.step2.title': 'Start the simulation',
    'landing.step2.desc': 'Agents make autonomous decisions based on their internal emotions.',
    'landing.step3.title': 'Analyze results',
    'landing.step3.desc': 'Observe interactions, rejections, bonds and isolation in real time.',
    'landing.footer': 'Social Behavior Lab · Experimental MVP',

    // Agent states
    'state.idle': 'Idle',
    'state.seeking': 'Seeking company',
    'state.approaching': 'Approaching',
    'state.interacting': 'Talking',
    'state.avoiding': 'Avoiding',
    'state.recovering': 'Recovering',
    'state.rejected': 'Rejected',

    // Control panel
    'ctrl.start': 'Start experiment',
    'ctrl.pause': 'Pause',
    'ctrl.resume': 'Resume',
    'ctrl.restart': 'Restart',
    'ctrl.metrics': 'Metrics',
    'ctrl.replay': 'View replay',
    'ctrl.stopReplay': 'Stop replay',
    'ctrl.editor': 'Editor',
    'ctrl.experiments': 'Scenarios',
    'ctrl.exp': 'Exp:',
    'ctrl.back': '← Home',

    // Events panel
    'events.title': 'Events',
    'events.count': '{n} events',
    'events.empty': 'Events will appear here when you start the simulation.',
    'event.interaction_accepted': '{nameA} and {nameB} started talking. Both gained confidence.',
    'event.interaction_rejected': '{nameB} rejected {nameA}. {nameA}\'s anxiety increased.',
    'event.interaction_end': '{nameA} and {nameB} finished talking.',

    // Metrics panel
    'metrics.title': 'Experiment results',
    'metrics.subtitle': 'Simulation summary',
    'metrics.interactions': 'Interactions',
    'metrics.rejections': 'Rejections',
    'metrics.avgDuration': 'Avg duration',
    'metrics.highestAnxiety': 'Highest anxiety',
    'metrics.mostSocial': 'Most social agent',
    'metrics.mostIsolated': 'Most isolated agent',
    'metrics.bestBond': 'Best bond',
    'metrics.narrative': 'Narrative summary',
    'metrics.close': 'Close',
    'metrics.times': 'times',
    'metrics.and': 'and',

    // Metrics narrative
    'narrative.noInteractions': 'The simulation ended without any agent managing to establish an interaction. Anxiety or isolation was too high to initiate contact.',
    'narrative.mostSocial': '{name} was the most social agent, participating in {count} interaction{plural}.',
    'narrative.isolated': '{name} ended up completely isolated, without achieving any interaction.',
    'narrative.lowActivity': '{name} had very little social activity ({count} interaction{plural}).',
    'narrative.rejections': '{count} rejection{plural} were recorded, raising anxiety levels in the group.',
    'narrative.bestPair': 'The pair with the strongest bond was {nameA} and {nameB}, who interacted {count} times.',
    'narrative.anxiety': 'At the end, {name} showed the highest anxiety ({value}/100).',
    'narrative.fallback': 'The simulation showed complex social dynamics between agents.',

    // Character editor
    'editor.title': 'Character editor',
    'editor.back': '← Home',
    'editor.startSim': '▶ Start simulation',
    'editor.characters': 'Characters',
    'editor.name': 'Name',
    'editor.color': 'Color',
    'editor.personality': 'Base personality',
    'editor.emotions': 'Emotional variables',
    'editor.select': 'Select a character to edit',

    // Emotion labels
    'emotion.soledad': 'Loneliness',
    'emotion.sociabilidad': 'Sociability',
    'emotion.ansiedad': 'Anxiety',
    'emotion.confianza': 'Confidence',
    'emotion.energiaSocial': 'Social energy',

    // Personalities
    'personality.extrovertido': 'Extroverted',
    'personality.introvertido': 'Introverted',
    'personality.ansioso': 'Anxious',
    'personality.solitario': 'Solitary',
    'personality.neutral': 'Neutral',
    'personality.desc.extrovertido': 'Seeks interaction frequently, tolerates rejection and recovers quickly.',
    'personality.desc.introvertido': 'Can interact but gets socially tired faster. Prefers small groups.',
    'personality.desc.ansioso': 'Wants to interact but hesitates. Avoids groups and is more affected by rejection.',
    'personality.desc.solitario': 'High need for connection but low probability of initiating. Isolates after rejection.',
    'personality.desc.neutral': 'Balanced. Accepts or rejects based on context.',

    // Experiments
    'experiments.title': 'Predefined scenarios',
    'experiments.subtitle': 'Choose an experiment to start',
    'experiments.random.title': 'Generate random scenario',
    'experiments.random.desc': 'Random combination of personalities and agents',
    'exp.fiesta.name': 'Party with strangers',
    'exp.fiesta.desc': '2 extroverts, 1 introvert, 1 anxious, 1 neutral. Who connects first?',
    'exp.grupoAnsioso.name': 'Anxious group',
    'exp.grupoAnsioso.desc': '3 anxious, 1 extrovert, 1 solitary. High social tension.',
    'exp.aislado.name': 'An isolated person',
    'exp.aislado.desc': '1 solitary surrounded by 4 sociable agents. Can they connect?',
    'exp.extrovertidos.name': 'All extroverted',
    'exp.extrovertidos.desc': '5 extroverts in the same room. Social chaos guaranteed.',
    'exp.equilibrado.name': 'Balanced group',
    'exp.equilibrado.desc': 'One of each personality type. Observe the natural balance.',

    // Simulation view
    'sim.back': '← Home',
    'sim.ready.title': 'Simulation ready',
    'sim.ready.desc': 'Press {btn} to observe how agents interact.',
    'sim.ready.change': 'Change scenario →',

    // Agent info card
    'agent.interactions': 'interact.',
    'agent.accepted': 'accepted',
    'agent.rejections': 'rejections',
  },
}

export function interpolate(str, params = {}) {
  return str.replace(/\{(\w+)\}/g, (_, key) => params[key] ?? `{${key}}`)
}
