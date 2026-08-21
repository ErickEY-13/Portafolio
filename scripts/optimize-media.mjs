/**
 * Optimiza el material pesado de /public para la web.
 *
 *   npm run media
 *
 * Qué hace:
 *   · vídeos          → los reencodea con H.264 y los deja listos para streaming
 *   · WebP/GIF animado → los convierte a MP4, que pesa entre 5 y 10 veces menos
 *
 * Por qué no basta con ffmpeg: su decodificador de WebP ignora los chunks ANIM
 * y ANMF, así que no sabe leer WebP animado (solo ve el primer fotograma). Aquí
 * los fotogramas se extraen con sharp (libvips, que sí los entiende) y se le
 * pasan a ffmpeg por stdin como vídeo en crudo.
 *
 * Los originales NO se tocan: la salida va a archivos nuevos.
 */
import { spawn } from 'node:child_process'
import { statSync } from 'node:fs'

// ffmpeg-static y sharp NO son dependencias fijas del proyecto: pesan más de
// 100 MB juntas y solo hacen falta el día que añades o cambias una demo.
// Se cargan a mano para poder avisar en condiciones si no están instaladas.
let ffmpegPath
let sharp
try {
  ffmpegPath = (await import('ffmpeg-static')).default
  sharp = (await import('sharp')).default
} catch {
  console.error(`
Faltan las herramientas de conversión. Instálalas solo para esta tarea:

  npm install -D ffmpeg-static sharp

Y cuando termines, si no las quieres fijas en el proyecto:

  npm uninstall ffmpeg-static sharp
`)
  process.exit(1)
}

/* --------------------------------- Ajustes -------------------------------- */

// Los originales viven en /media-src (fuera del build y sin control de
// versiones). Aquí solo se declara qué sale de cada uno.
const JOBS = [
  {
    input: 'media-src/arludent-demo.webp',
    output: 'public/projects/video/arludent.mp4',
    poster: 'public/projects/arludent-poster.webp',
    width: 1280,
    crf: 30,
  },
  {
    input: 'media-src/energy-home-demo.webp',
    output: 'public/projects/video/energy-home.mp4',
    poster: 'public/projects/energy-home-poster.webp',
    width: 1280,
    crf: 30,
  },
  {
    input: 'media-src/sire-original.mp4',
    output: 'public/projects/video/sire.mp4',
    poster: 'public/projects/sire-poster.webp',
    width: 640,
    crf: 31,
    fps: 24,
  },
]

// Segundo del que se saca el póster. El primer fotograma suele estar en negro
// o a medio pintar, así que se coge un poco más adelante.
const SEGUNDO_DEL_POSTER = 2

// Cuántos fotogramas se decodifican de una vez. Más alto = menos trabajo
// repetido, pero más memoria (ancho x alto x 3 bytes x FRAMES_POR_LOTE).
const FRAMES_POR_LOTE = 50

/* -------------------------------- Utilidades ------------------------------ */

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`
const isAnimatedImage = (file) => /\.(webp|gif|apng)$/i.test(file)

/** Espera a que el pipe acepte más datos (control de contrapresión). */
function write(stream, chunk) {
  return new Promise((resolve, reject) => {
    if (stream.write(chunk)) return resolve()
    // Hay que retirar el listener que no se dispara: si no, cada lote deja
    // uno colgado y Node avisa de fuga a partir del undécimo.
    const onDrain = () => {
      stream.off('error', onError)
      resolve()
    }
    const onError = (error) => {
      stream.off('drain', onDrain)
      reject(error)
    }
    stream.once('drain', onDrain)
    stream.once('error', onError)
  })
}

function run(args, { onStdin } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: [onStdin ? 'pipe' : 'ignore', 'ignore', 'pipe'] })

    let stderr = ''
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg salió con código ${code}\n${stderr.slice(-1200)}`))
    })

    if (onStdin) {
      child.stdin.on('error', () => {
        /* ffmpeg cerró antes de tiempo: el error real llega por 'close' */
      })
      onStdin(child.stdin).then(
        () => child.stdin.end(),
        (error) => {
          child.stdin.destroy()
          reject(error)
        },
      )
    }
  })
}

/* ------------------------- WebP/GIF animado → MP4 ------------------------- */

async function animationToVideo({ input, output, width, crf }) {
  const meta = await sharp(input, { animated: true, limitInputPixels: false }).metadata()
  const frames = meta.pages
  const delays = meta.delay ?? []
  const totalMs = delays.reduce((a, b) => a + b, 0)
  const fps = totalMs ? Math.max(1, Math.round(frames / (totalMs / 1000))) : 10

  // Alto proporcional al ancho de destino, forzado a par (lo exige yuv420p).
  const height = Math.round((meta.pageHeight * width) / meta.width) & ~1

  console.log(
    `  ${frames} fotogramas · ${meta.width}x${meta.pageHeight} · ` +
      `${(totalMs / 1000).toFixed(1)}s · ${fps} fps → ${width}x${height}`,
  )

  const args = [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${width}x${height}`, '-framerate', String(fps),
    '-i', '-',
    '-c:v', 'libx264', '-crf', String(crf), '-preset', 'veryslow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    output,
  ]

  await run(args, {
    onStdin: async (stdin) => {
      for (let start = 0; start < frames; start += FRAMES_POR_LOTE) {
        const pages = Math.min(FRAMES_POR_LOTE, frames - start)

        // sharp devuelve el lote como una tira vertical de fotogramas, que en
        // crudo es exactamente lo que espera el demuxer rawvideo de ffmpeg.
        const buffer = await sharp(input, {
          animated: true,
          limitInputPixels: false,
          page: start,
          pages,
        })
          .resize({ width, height, fit: 'fill' })
          .removeAlpha()
          .raw()
          .toBuffer()

        await write(stdin, buffer)
        process.stdout.write(`\r  procesando… ${Math.min(start + pages, frames)}/${frames}`)
      }
      process.stdout.write('\r'.padEnd(40) + '\r')
    },
  })
}

/* ------------------------------ Vídeo → vídeo ----------------------------- */

async function videoToVideo({ input, output, width, crf, fps }) {
  const filters = [`scale=${width}:-2`]
  if (fps) filters.push(`fps=${fps}`)

  await run([
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', input,
    '-vf', filters.join(','),
    '-c:v', 'libx264', '-crf', String(crf), '-preset', 'veryslow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    output,
  ])
}

/* --------------------------- Póster del vídeo ----------------------------- */

/**
 * Extrae un fotograma del MP4 ya optimizado y lo guarda en WebP.
 * Se muestra al instante mientras el vídeo carga, y hace de respaldo si el
 * navegador no puede reproducirlo.
 */
async function makePoster(video, poster) {
  await run([
    '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', String(SEGUNDO_DEL_POSTER), '-i', video,
    '-frames:v', '1', '-q:v', '70', '-c:v', 'libwebp',
    poster,
  ])
}

/* --------------------------------- Main ----------------------------------- */

let antes = 0
let despues = 0

for (const job of JOBS) {
  let sizeIn
  try {
    sizeIn = statSync(job.input).size
  } catch {
    console.log(`— ${job.input}: no existe, se omite`)
    continue
  }

  console.log(`\n▸ ${job.input}`)
  const started = Date.now()

  if (isAnimatedImage(job.input)) await animationToVideo(job)
  else await videoToVideo(job)

  if (job.poster) await makePoster(job.output, job.poster)

  const sizeOut = statSync(job.output).size
  antes += sizeIn
  despues += sizeOut

  const ahorro = (100 - (sizeOut / sizeIn) * 100).toFixed(0)
  console.log(
    `  ${job.output} · ${mb(sizeIn)} → ${mb(sizeOut)} (-${ahorro}%) · ` +
      `${((Date.now() - started) / 1000).toFixed(0)}s`,
  )
  if (job.poster) console.log(`  ${job.poster} · ${mb(statSync(job.poster).size)}`)
}

console.log(`\nTotal: ${mb(antes)} → ${mb(despues)}`)
