# Social Behavior Lab

**Experimentos sociales 3D con agentes autónomos**

Una simulación visual donde personajes virtuales con variables emocionales toman decisiones sociales en tiempo real. Observa cómo se forman amistades, rechazos, vínculos y aislamiento según la personalidad de cada agente.

![Social Behavior Lab](https://img.shields.io/badge/version-0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![React](https://img.shields.io/badge/React-18-61dafb) ![Three.js](https://img.shields.io/badge/Three.js-r167-black)

---

## Demo

> 🔗 **[Ver demo en vivo](https://manuelgoicochea.github.io/social-behavior-lab/)**

---

## ¿Qué es esto?

Social Behavior Lab es un MVP de laboratorio social visual. Creas personajes con distintas personalidades (extrovertido, introvertido, ansioso, solitario, neutral) y observas cómo se relacionan dentro de una sala 3D.

Cada agente tiene variables emocionales internas:

| Variable | Rango | Efecto |
|---|---|---|
| Soledad | 0–100 | Alta → busca interacción |
| Sociabilidad | 0–100 | Alta → inicia contacto más seguido |
| Ansiedad | 0–100 | Alta → evita grupos, más rechazos |
| Confianza | 0–100 | Baja → evita a quien lo rechazó |
| Energía social | 0–100 | Baja → se aísla a recuperarse |

---

## Características

- **Simulación 3D** con React Three Fiber — escena isométrica con sala, iluminación y grid
- **Motor de reglas** basado en ticks — sin IA, solo lógica determinista con probabilidad
- **5 personalidades predefinidas** — Extrovertido, Introvertido, Ansioso, Solitario, Neutral
- **Estados de comportamiento** — idle, seeking, approaching, interacting, avoiding, recovering, rejected
- **Feedback visual** — color emocional en la cabeza del agente, burbujas de estado, líneas de interacción verde/roja
- **Panel de eventos** en tiempo real — log narrado de cada interacción
- **Controles de simulación** — play, pausa, velocidades x0.5 / x1 / x2 / x4, reiniciar
- **Métricas finales** — agente más social, más aislado, pareja con mejor vínculo, resumen narrativo
- **Replay interno** — graba cada tick y permite reproducir la sesión
- **Editor de personajes** — nombre, color, sliders por variable emocional
- **5 escenarios predefinidos** + generador aleatorio

---

## Stack técnico

| Tecnología | Uso |
|---|---|
| React 18 | UI y ciclo de vida |
| React Three Fiber | Renderizado 3D declarativo |
| Drei | Helpers para R3F (Html, Grid, OrbitControls) |
| Zustand | Estado global de la simulación |
| Tailwind CSS | Estilos de la interfaz |
| Vite | Build tool y dev server |

100% frontend — sin backend, sin base de datos, sin autenticación.

---

## Instalación y uso

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/manuelgoicochea/social-behavior-lab.git
cd social-behavior-lab

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción en /dist
npm run preview  # Preview del build de producción
```

---

## Estructura del proyecto

```
src/
├── components/
│   ├── LandingPage.jsx       # Página de inicio
│   ├── SimulationView.jsx    # Vista principal de simulación
│   ├── SimulationCanvas.jsx  # Escena 3D (React Three Fiber)
│   ├── Agent.jsx             # Mesh 3D del agente con animación
│   ├── AgentLabel.jsx        # Burbuja de nombre y estado
│   ├── InteractionLine.jsx   # Líneas de interacción entre agentes
│   ├── ControlPanel.jsx      # Controles de simulación
│   ├── EventLog.jsx          # Panel lateral de eventos
│   ├── MetricsPanel.jsx      # Métricas y resumen narrativo
│   ├── CharacterEditor.jsx   # Editor de personalidades
│   └── ExperimentSelector.jsx # Escenarios predefinidos
│
├── simulation/
│   ├── engine.js             # Loop principal (ticks)
│   ├── rules.js              # Reglas de comportamiento y deltas emocionales
│   ├── personalities.js      # 5 plantillas de personalidad
│   ├── experiments.js        # Escenarios predefinidos + generador aleatorio
│   ├── metrics.js            # Cálculo de métricas finales
│   └── replay.js             # Helpers de replay
│
└── store/
    └── simulationStore.js    # Estado global con Zustand
```

---

## Cómo funciona el motor

La simulación corre en un loop de ticks (por defecto 1 tick/segundo, ajustable).

**Cada tick:**
1. Se evalúan los pares de interacción activos y se reducen sus ticks restantes
2. Se limpia la memoria de rechazos antiguos
3. `evaluateAgent()` decide el nuevo estado de cada agente según sus emociones
4. Los agentes se mueven hacia su `targetPosition` a velocidad constante (0.8 u/tick)
5. Se evalúan interacciones cuando dos agentes están a menos de 2.2 unidades
6. Se calculan deltas emocionales y se registran eventos
7. Se captura un frame para el replay

**Probabilidad de aceptar interacción:**

```
P(aceptar) = (sociabilidad + confianza - ansiedad + energiaSocial) / 300
```

---

## Deploy

El proyecto incluye un workflow de GitHub Actions para despliegue automático en GitHub Pages.

**Cada push a `main` dispara el deploy automáticamente.**

Para configurar manualmente:

1. Ajustar `base` en `vite.config.js` con el nombre exacto del repositorio
2. Ir a **Settings → Pages → Source → gh-pages branch**

---

## Contribuir

Las contribuciones son bienvenidas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

Ideas de mejora para futuras versiones:
- Más tipos de personalidad
- Diálogos procedurales entre agentes
- Múltiples salas / escenarios
- Exportar simulación como video o GIF
- Modo observador con cámara libre
- Gráficas de emociones en tiempo real

---

## Licencia

[MIT](LICENSE) — libre para usar, modificar y distribuir.

---

*Construido como experimento de validación de idea. MVP · v0.1.0*
