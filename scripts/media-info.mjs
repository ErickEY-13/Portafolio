/**
 * Inspecciona archivos de media: node scripts/media-info.mjs <archivo...>
 * Útil antes de optimizar, para saber cuántos fotogramas y qué duración tienen.
 */
import sharp from 'sharp'

for (const file of process.argv.slice(2)) {
  try {
    const meta = await sharp(file, { animated: true, limitInputPixels: false }).metadata()
    const delays = meta.delay ?? []
    const total = delays.reduce((a, b) => a + b, 0)
    const fps = total ? (delays.length / (total / 1000)).toFixed(1) : '?'
    console.log(
      `${file}\n  frames: ${meta.pages}  ·  ${meta.width}x${meta.pageHeight}  ·  ` +
        `duracion: ${(total / 1000).toFixed(1)}s  ·  ~${fps} fps`,
    )
  } catch (error) {
    console.log(`${file}\n  ERROR: ${error.message}`)
  }
}
