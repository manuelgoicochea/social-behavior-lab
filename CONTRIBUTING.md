# Guía de contribución

¡Gracias por tu interés en contribuir a Social Behavior Lab!

## Cómo empezar

1. **Fork** el repositorio
2. **Clona** tu fork localmente:
   ```bash
   git clone https://github.com/TU_USUARIO/social-behavior-lab.git
   cd social-behavior-lab
   npm install
   npm run dev
   ```
3. Crea una **rama** para tu cambio:
   ```bash
   git checkout -b feat/nombre-de-tu-feature
   ```
4. Haz tus cambios, **commitea** y sube:
   ```bash
   git commit -m "feat: descripción clara del cambio"
   git push origin feat/nombre-de-tu-feature
   ```
5. Abre un **Pull Request** hacia `main`

## Tipos de contribución

### 🐛 Reportar un bug
Abre un [Issue](https://github.com/manuelgoicochea/social-behavior-lab/issues/new?template=bug_report.md) con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Captura de pantalla si aplica

### 💡 Proponer una feature
Abre un [Issue](https://github.com/manuelgoicochea/social-behavior-lab/issues/new?template=feature_request.md) describiendo:
- El problema que resuelve
- Cómo debería funcionar
- Si ya tienes una implementación en mente

### 🔧 Enviar código
- Mantén los cambios enfocados — un PR por feature o fix
- Sigue el estilo existente (sin TypeScript, sin clases, hooks funcionales)
- No agregar dependencias pesadas sin discutirlo primero
- El motor de reglas (`simulation/`) debe permanecer determinista y sin IA externa

## Convenciones de commits

```
feat: nueva funcionalidad
fix: corrección de bug
refactor: refactorización sin cambio de comportamiento
style: cambios visuales o CSS
docs: documentación
chore: configuración, dependencias
```

## Áreas donde ayuda es especialmente bienvenida

- Nuevos tipos de personalidad con comportamientos distintos
- Mejoras visuales en los agentes 3D
- Gráficas de evolución emocional en tiempo real
- Traducción a otros idiomas
- Tests para el motor de reglas (`simulation/engine.js`, `simulation/rules.js`)
- Optimización de rendimiento para muchos agentes (>10)

## Preguntas

Abre un Issue con el label `question` o contacta directamente por GitHub.
