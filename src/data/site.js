/* ---------------------------------------------------------------------------
   Fuente única de verdad del portafolio.
   Edita SOLO este archivo para actualizar contenido: los componentes leen de aquí.
--------------------------------------------------------------------------- */

export const site = {
  name: 'Erick Ayma',
  fullName: 'Erick Yoel Ayma Choque',
  role: 'Desarrollador Full Stack',
  degree: 'Bachiller en Ingeniería de Sistemas',
  location: 'Tacna, Perú',

  // Resumen del hero. A partir de unos 250 caracteres ocupa 4 líneas y empieza
  // a competir con el titular, así que conviene no alargarlo mucho más.
  summary:
    'Construyo aplicaciones web y móviles robustas aplicando buenas prácticas de ingeniería, arquitectura limpia y código mantenible. Especializado en transformar flujos complejos en sistemas escalables, seguros y centrados en una excelente experiencia de usuario.',

  // Tu retrato: deja el archivo en /public/foto.jpg.
  // Si aún no existe, el hero muestra un marcador en vez de romperse.
  photo: 'foto.jpg',

  // Sustituye este PDF por el tuyo manteniendo el mismo nombre de archivo.
  resumeUrl: 'cv/CV_Erick_Ayma_Choque_Desarrollador.pdf',

  socials: {
    github: 'https://github.com/ErickEY-13',
    linkedin: 'https://www.linkedin.com/in/erick-yoel-ayma-choque-511956330',
    email: 'erick.yoelac@gmail.com',
    phone: '990 342 764',
  },
}

// Usuario usado por el hook que consume la API pública de GitHub.
export const GITHUB_USERNAME = 'ErickEY-13'

/* --------------------------------- Navegación --------------------------- */
export const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Repositorios', href: '#repositorios' },
  { label: 'Trayectoria', href: '#trayectoria' },
  { label: 'Stack', href: '#stack' },
]

/* --------------------------- Proyectos destacados ------------------------ */
// `media`  : lo que se muestra en la tarjeta. Vale un MP4 (se reproduce en
//             bucle y sin sonido) o una imagen, incluido WebP/GIF animado.
// `poster` : fotograma de respaldo. Se usa como póster del vídeo mientras carga
//             y como plan B si `media` falla. Rutas relativas a /public.
export const featuredProjects = [
  {
    title: 'Arludent',
    subtitle: 'Plataforma de gestión odontológica con agente IA',
    year: '2025',
    description:
      'Gestión clínica, administrativa y financiera para consultorios dentales: historial con odontograma interactivo en SVG, chatbot conversacional ARLU, control de citas y emisión automática de comprobantes.',
    media: 'projects/video/arludent.mp4',
    poster: 'projects/arludent-poster.webp',
    tags: ['Vue 3', 'Laravel 12', 'FastAPI', 'MySQL', 'Docker'],
    demo: '',
    repo: 'https://github.com/ErickEY-13/Arludent-Project',
  },
  {
    title: 'Energy Home',
    subtitle: 'IoT + monitoreo energético residencial',
    year: '2025',
    description:
      'Monitoreo y control del consumo eléctrico en tiempo real. Procesa telemetría de un ESP32 simulado para calcular costos proyectados en soles, detectar anomalías y sugerir patrones óptimos de consumo.',
    media: 'projects/video/energy-home.mp4',
    poster: 'projects/energy-home-poster.webp',
    tags: ['Next.js', 'NestJS', 'Prisma', 'MySQL', 'ECharts'],
    demo: '',
    repo: 'https://github.com/ErickEY-13/energy-home',
  },
  {
    title: 'SIRE',
    subtitle: 'Secure Emergency Gateway — app móvil',
    year: '2025',
    description:
      'Frontend móvil del ecosistema SIRE, conectado a una API de reconocimiento facial con DeepFace (ArcFace) y búsqueda vectorial en Qdrant para verificar identidades en milisegundos.',
    media: 'projects/video/sire.mp4',
    poster: 'projects/sire-poster.webp',
    tags: ['Flutter', 'Dart', 'Firebase', 'FastAPI', 'Qdrant'],
    demo: '',
    repo: 'https://github.com/ErickEY-13/app_reconocimiento_sire',
  },
]

/* ------------------------------- Trayectoria ----------------------------- */
export const experience = [
  {
    role: 'Desarrollador Full Stack (Proyecto)',
    company: 'Municipalidad Distrital de Locumba',
    highlights: [
      'Plataforma web integral (Intranet Municipal) para Limpieza Pública, Seguridad Ciudadana, Trámite Documentario y Almacén, con Laravel en el backend y Angular en el frontend.',
      'APIs RESTful, geolocalización en tiempo real con mapas interactivos, sistema de permisos y roles, y notificaciones en vivo por WebSockets.',
      'Modelado y administración de la base de datos relacional, y automatización de reportes en Excel y PDF.',
    ],
    stack: ['Laravel', 'Angular', 'WebSockets', 'PostgreSQL'],
  },
  {
    role: 'Desarrollador Mobile / Frontend',
    company: 'Soluciones Car Tacna',
    highlights: [
      'Desarrollo e implementación de una aplicación móvil corporativa en React Native.',
      'Diseño e integración de APIs REST con backend Laravel, participando en la arquitectura y el despliegue de servicios.',
      'Optimización del rendimiento de la app y soporte técnico durante todo el ciclo de desarrollo.',
    ],
    stack: ['React Native', 'Laravel', 'REST API'],
  },
  {
    role: 'Soporte Técnico TI (Prácticas)',
    company: 'MIJO STORE E.I.R.L. Tacna',
    highlights: [
      'Administración y mantenimiento de infraestructura tecnológica y servidores.',
      'Despliegue, configuración y actualización de aplicaciones en entornos Linux.',
      'Diagnóstico y resolución de incidencias en hardware, software y servicios de red.',
    ],
    stack: ['Linux', 'Redes', 'Servidores'],
  },
]

export const education = {
  school: 'Universidad Privada de Tacna',
  degree: 'Bachiller en Ingeniería de Sistemas',
  extra: 'Inglés (Intermedio)',
}

/* ------------------------------- Tech stack ------------------------------ */
// Cada nombre debe existir en `techIcons` (src/data/tech.js) para que
// se muestre su logo. Si no está registrado, sale solo el texto.
export const techStack = [
  {
    group: 'Backend',
    items: ['Laravel', 'PHP', 'Node.js', 'NestJS', 'FastAPI', 'Python'],
  },
  {
    group: 'Frontend & Mobile',
    items: ['React', 'React Native', 'Angular', 'Vue.js', 'Flutter', 'Tailwind CSS'],
  },
  {
    group: 'Bases de datos',
    items: ['PostgreSQL', 'Supabase', 'MySQL', 'MariaDB', 'Prisma', 'Firebase', 'Qdrant'],
  },
  {
    group: 'Herramientas & SO',
    items: ['Git', 'GitHub', 'Docker', 'Linux', 'Postman', 'Cypress'],
  },
]

/* --------- Colores oficiales de lenguajes (GitHub Linguist) -------------- */
export const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Blade: '#f7523f',
  Ruby: '#701516',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  'Jupyter Notebook': '#DA5B0B',
  SCSS: '#c6538c',
  Astro: '#ff5a03',
  Dockerfile: '#384d54',
}
