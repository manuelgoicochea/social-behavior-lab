// replay.js — gestión del replay
// Los frames se guardan en el store; este módulo exporta helpers

export function getFrameAtTick(frames, tick) {
  if (!frames || frames.length === 0) return null
  const idx = Math.min(tick, frames.length - 1)
  return frames[idx]
}

export function getReplayProgress(replayTick, totalFrames) {
  if (totalFrames === 0) return 0
  return Math.min(replayTick / totalFrames, 1)
}

export function formatTick(tick) {
  const seconds = Math.floor(tick)
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
