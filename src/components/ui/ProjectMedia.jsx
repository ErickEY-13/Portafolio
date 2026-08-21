import { useEffect, useRef, useState } from 'react'
import { asset } from '../../lib/utils'

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v)$/i

// Proporción de la caja antes de conocer el tamaño real del archivo.
const RATIO_INICIAL = 16 / 10

// Caja para material vertical: se mantiene apaisada y el vídeo va centrado
// dentro, como si fuera la maqueta de un móvil.
const RATIO_VERTICAL = 4 / 3

/**
 * Preview de un proyecto. Acepta tres cosas sin configuración extra:
 *   · vídeo (.mp4 / .webm / .mov) → <video> en bucle y sin sonido
 *   · WebP o GIF animado         → <img> (se anima solo)
 *   · imagen estática            → <img>
 *
 * Encuadre: la caja adopta la proporción real del archivo en cuanto se conoce,
 * así que el material apaisado se ve ENTERO, sin recortes. Solo el vertical usa
 * una caja fija y se centra dentro; si tomara su propia proporción, una
 * grabación 9:16 haría la tarjeta absurdamente alta.
 *
 * El vídeo se reproduce solo mientras la tarjeta está en pantalla y se pausa al
 * salir; así también funciona en móvil, donde no existe el hover. Si el archivo
 * falta o no se puede decodificar, cae al póster en lugar de dejar un hueco.
 */
export default function ProjectMedia({ media, poster, title }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const [ratio, setRatio] = useState(null)

  const isVideo = VIDEO_EXTENSIONS.test(media ?? '') && !failed
  const imageSrc = failed || !media ? poster : media

  const portrait = ratio !== null && ratio < 1
  const boxRatio = ratio === null ? RATIO_INICIAL : portrait ? RATIO_VERTICAL : ratio

  useEffect(() => {
    const element = ref.current
    if (!element || !isVideo) return

    // Respeta a quien pidió menos movimiento: se queda el póster.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.play().catch(() => {
            /* autoplay bloqueado: se queda el póster */
          })
        } else {
          element.pause()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVideo])

  // `contain` solo hace falta en vertical: en apaisado la caja ya tiene la
  // proporción exacta del archivo, así que `cover` encaja sin recortar nada.
  const fit = portrait ? 'object-contain' : 'object-cover'

  return (
    <div
      className={`relative w-full overflow-hidden ${portrait ? 'bg-surface-2' : ''}`}
      style={{ aspectRatio: boxRatio }}
    >
      {isVideo ? (
        <video
          ref={ref}
          src={asset(media)}
          poster={poster ? asset(poster) : undefined}
          onLoadedMetadata={(event) => {
            const { videoWidth, videoHeight } = event.currentTarget
            if (videoWidth && videoHeight) setRatio(videoWidth / videoHeight)
          }}
          onError={() => setFailed(true)}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`Demostración de ${title}`}
          className={`h-full w-full ${fit}`}
        />
      ) : (
        <img
          src={asset(imageSrc)}
          alt={`Vista previa de ${title}`}
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget
            if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight)
          }}
          onError={() => setFailed(true)}
          loading="lazy"
          decoding="async"
          className={`h-full w-full ${fit}`}
        />
      )}
    </div>
  )
}
