import Experience from './components/Experience'
import FeaturedProjects from './components/FeaturedProjects'
import Footer from './components/Footer'
import GithubRepos from './components/GithubRepos'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import TechStack from './components/TechStack'

export default function App() {
  return (
    <div className="noise relative min-h-screen bg-canvas">
      {/* Salto de accesibilidad para navegación por teclado */}
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[70] focus:rounded-full focus:bg-invert focus:px-4 focus:py-2 focus:text-sm focus:text-on-invert"
      >
        Saltar al contenido
      </a>

      <Navbar />

      <main>
        <Hero />
        <FeaturedProjects />
        <GithubRepos />
        <Experience />
        <TechStack />
      </main>

      <Footer />
    </div>
  )
}
