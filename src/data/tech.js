/* ---------------------------------------------------------------------------
   Registro de tecnologías → logo.

   Los SVG viven en /public/stacks y salen de Simple Icons (licencia CC0),
   descargados ya con el color oficial de cada marca.

   `dark` solo existe para los logos cuyo color de marca es casi negro
   (Angular, GitHub, Next.js, Prisma, MariaDB): en modo oscuro se cambia por
   una versión clara, si no, desaparecerían contra el fondo.

   Para añadir una tecnología:
     1. descarga el logo:  https://cdn.simpleicons.org/<slug>
     2. guárdalo en        public/stacks/<slug>.svg
     3. añade aquí la entrada con la etiqueta que quieras mostrar
--------------------------------------------------------------------------- */

const icon = (file, dark) => ({ src: `stacks/${file}.svg`, dark: dark ? `stacks/${dark}.svg` : null })

export const techIcons = {
  // Lenguajes
  PHP: icon('php'),
  Python: icon('python'),
  TypeScript: icon('typescript'),
  Dart: icon('dart'),

  // Backend
  Laravel: icon('laravel'),
  'Laravel 12': icon('laravel'),
  'Node.js': icon('nodedotjs'),
  NestJS: icon('nestjs'),
  FastAPI: icon('fastapi'),

  // Frontend y mobile
  React: icon('react'),
  'React Native': icon('react'),
  Angular: icon('angular', 'angular-dark'),
  'Vue.js': icon('vuedotjs'),
  'Vue 3': icon('vuedotjs'),
  'Next.js': icon('nextdotjs', 'nextdotjs-dark'),
  Flutter: icon('flutter'),
  'Tailwind CSS': icon('tailwindcss'),
  ECharts: icon('apacheecharts'),

  // Datos
  PostgreSQL: icon('postgresql'),
  MySQL: icon('mysql'),
  MariaDB: icon('mariadb', 'mariadb-dark'),
  Prisma: icon('prisma', 'prisma-dark'),
  Firebase: icon('firebase'),
  Supabase: icon('supabase'),
  Qdrant: icon('qdrant'),

  // Herramientas
  Git: icon('git'),
  GitHub: icon('github', 'github-dark'),
  Docker: icon('docker'),
  Linux: icon('linux'),
  Postman: icon('postman'),
  Cypress: icon('cypress'),
}

/** Devuelve el logo de una tecnología, o null si no está registrada. */
export const getTechIcon = (name) => techIcons[name] ?? null
