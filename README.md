# Portafolio — Erick Ayma

Portafolio personal estático: React 19 + Vite + Tailwind CSS v4 + Framer Motion, con modo claro/oscuro y despliegue automático en GitHub Pages.

**En vivo:** https://erickey-13.github.io/Portafolio/

---

## Desarrollo

```bash
npm install
npm run dev
```

| Comando           | Qué hace                                   |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo en `localhost:5173` |
| `npm run build`   | Compila a `dist/`                          |
| `npm run preview` | Sirve `dist/` para revisar el build final  |
| `npm run media`   | Convierte los originales de `media-src/`   |

---

## Qué editar

Casi todo el contenido vive en un solo archivo: **`src/data/site.js`**.

| Quiero cambiar…             | Dónde                                            |
| --------------------------- | ------------------------------------------------ |
| Nombre, rol, resumen, redes | `site` en `src/data/site.js`                     |
| Proyectos destacados        | `featuredProjects` en `src/data/site.js`         |
| Experiencia y educación     | `experience` / `education` en `src/data/site.js` |
| Usuario de GitHub           | `GITHUB_USERNAME` en `src/data/site.js`          |
| Tech stack                  | `techStack` en `src/data/site.js`                |
| Colores del tema            | Bloques `:root` y `.dark` en `src/index.css`     |

> Las rutas de `/public` deben pasar siempre por el helper `asset()` de `src/lib/utils.js`.
> En producción el sitio cuelga de `/Portafolio/`, así que una ruta absoluta como `/cv.pdf` daría 404.

---

## Media

El sitio publicado pesa **5.1 MB**. Los originales sin comprimir (36 MB) viven en
`media-src/`, fuera del build y fuera de git.

| Archivo publicado                                  | Origen                    | Peso   |
| -------------------------------------------------- | ------------------------- | ------ |
| `public/foto.jpg`                                  | —                         | 379 KB |
| `public/cv/CV_Erick_Ayma_Choque_Desarrollador.pdf` | —                         | 6 KB   |
| `public/projects/video/arludent.mp4`               | WebP animado de 11.5 MB   | 546 KB |
| `public/projects/video/energy-home.mp4`            | WebP animado de 12.5 MB   | 1.1 MB |
| `public/projects/video/sire.mp4`                   | MOV de 12.4 MB            | 2.5 MB |
| `public/projects/*-poster.webp`                    | fotograma de cada vídeo   | ~23 KB |

Cada proyecto declara en `src/data/site.js` un campo `media` (lo que se ve) y un
`poster` (respaldo). [`ProjectMedia`](src/components/ui/ProjectMedia.jsx) decide
por la extensión si monta un `<video>` o un `<img>`, detecta si el material es
vertical para no recortarlo, y reproduce el vídeo solo mientras la tarjeta está
en pantalla.

### Convertir demos nuevas

```bash
npm install -D ffmpeg-static sharp && npm run media && npm uninstall ffmpeg-static sharp
```

`scripts/optimize-media.mjs` lee la lista `JOBS`, convierte cada original de
`media-src/` a MP4 y extrae su póster. Las dos herramientas no son dependencias
fijas porque pesan más de 100 MB y solo hacen falta al añadir una demo; el script
avisa con el comando exacto si no están.

Detalle no obvio: **ffmpeg no sabe leer WebP animado** — ignora los chunks `ANIM`
y `ANMF` y solo ve el primer fotograma. Por eso el script extrae los fotogramas
con sharp (libvips) y se los pasa a ffmpeg por stdin como vídeo en crudo.

Instrucciones paso a paso en `public/_LEEME.txt`.

### Logos de tecnologías

Los SVG de `public/stacks/` vienen de [Simple Icons](https://simpleicons.org) (CC0),
ya con el color oficial de cada marca. El mapa nombre → logo está en
`src/data/tech.js`; si una tecnología no está registrada, la etiqueta se muestra
solo con texto. Los logos casi negros tienen un `<slug>-dark.svg` en blanco que se
intercambia por CSS (`dark:hidden`), sin JavaScript.


---

## Sistema de temas

No hay clases `dark:` repartidas por los componentes. En su lugar se usan **tokens
semánticos**: los utilitarios (`bg-canvas`, `text-ink`, `border-line`…) apuntan a
variables `--t-*` que cambian de valor al alternar el tema.

```
src/index.css       :root  → modo claro   ·   .dark → modo oscuro
index.html          script que aplica el tema ANTES del primer pintado (sin parpadeo)
src/hooks/useTheme  persistencia en localStorage + preferencia del sistema
```

Para cambiar un color de todo el sitio basta con editar su token en un sitio.
El color de resalte es `--t-accent` (`#0000ff`); `--t-accent-ink` es la variante
que se usa cuando el acento va como **texto**, porque el azul puro no tiene
contraste suficiente sobre fondo oscuro.

---

## Arquitectura

```
src/
├─ App.jsx                    Composición de las secciones
├─ index.css                  Tokens de tema + utilidades propias (Tailwind v4)
├─ components/
│  ├─ Navbar.jsx              Nav fija con blur, sección activa, progreso y tema
│  ├─ Hero.jsx                Nombre, rol, grado, CTAs y redes
│  ├─ FeaturedProjects.jsx    Tarjetas grandes alternadas con preview
│  ├─ GithubRepos.jsx         Repos desde la API pública + buscador y filtros
│  ├─ Experience.jsx          Trayectoria laboral y educación
│  ├─ TechStack.jsx           Grid de herramientas por grupo
│  ├─ Footer.jsx              Contacto, redes y copyright
│  └─ ui/
│     ├─ Reveal.jsx           Aparición al hacer scroll (y + blur)
│     ├─ SectionHeading.jsx   Encabezado de sección reutilizable
│     ├─ SpotlightCard.jsx    Tarjeta con halo que sigue al cursor
│     ├─ Portrait.jsx         Retrato con marcador si falta foto.jpg
│     ├─ ProjectMedia.jsx     Vídeo, WebP animado o imagen, según extensión
│     ├─ TechIcon.jsx         Logo de tecnología con resplandor en hover
│     └─ ThemeToggle.jsx      Interruptor claro/oscuro
├─ hooks/
│  ├─ useGithubRepos.js       Fetch + caché + estados de carga/error
│  └─ useTheme.js             Tema con persistencia
├─ lib/utils.js               asset() y timeAgo()
└─ data/
   ├─ site.js                 Contenido del sitio
   └─ tech.js                 Mapa tecnología → logo

scripts/
├─ optimize-media.mjs         Originales de media-src/ → MP4 + póster
└─ media-info.mjs             Fotogramas y duración de un archivo animado
```

### Sobre la API de GitHub

Se consume `https://api.github.com/users/{usuario}/repos` sin token (60 peticiones/hora por IP).
Para no gastar ese margen, el hook cachea la respuesta en `localStorage` durante **1 hora** y,
si se agota el límite, muestra un estado de error con enlace directo al perfil.
Se omiten los repos archivados y los forks (`includeForks: true` para incluirlos).

---

## Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica en cada push a `main`.

**Configuración inicial (una sola vez):**

1. En el repositorio: **Settings → Pages**.
2. En _Build and deployment → Source_, elige **GitHub Actions**.
3. Haz push a `main`. El sitio queda en `https://<usuario>.github.io/<repo>/`.

**Si cambias el nombre del repositorio**, actualiza `REPO_NAME` en `vite.config.js`.
Con dominio propio o un repo `<usuario>.github.io`, usa `base: '/'`.
