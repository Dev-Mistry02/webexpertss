import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Layers, Monitor, Palette, Rocket, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    title: 'Website Design & Development',
    detail: 'High-converting websites crafted with editorial precision and modern performance standards.',
    icon: Monitor,
  },
  {
    title: 'Web Applications',
    detail: 'Scalable product experiences with thoughtful UX systems and robust engineering foundations.',
    icon: Layers,
  },
  {
    title: 'UI/UX Design',
    detail: 'Clear user journeys, motion-aware interfaces, and product-ready design systems.',
    icon: Sparkles,
  },
  {
    title: 'Branding & Digital Solutions',
    detail: 'Brand strategy, identity direction, and digital ecosystems built to accelerate growth.',
    icon: Palette,
  },
]

const projects = [
  { name: 'NOVA Atelier', category: 'Luxury E-commerce' },
  { name: 'VectorFlow', category: 'SaaS Platform' },
  { name: 'Pulse Health', category: 'Digital Product' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

function MagneticButton() {
  const buttonRef = useRef(null)

  useEffect(() => {
    const btn = buttonRef.current
    if (!btn) return undefined

    const move = (event) => {
      const bounds = btn.getBoundingClientRect()
      const x = event.clientX - bounds.left - bounds.width / 2
      const y = event.clientY - bounds.top - bounds.height / 2
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.25, ease: 'power3.out' })
    }

    const reset = () => gsap.to(btn, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' })

    btn.addEventListener('mousemove', move)
    btn.addEventListener('mouseleave', reset)

    return () => {
      btn.removeEventListener('mousemove', move)
      btn.removeEventListener('mouseleave', reset)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      className="inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-sand transition-colors hover:bg-transparent hover:text-ink"
    >
      Start Your Project
      <ArrowUpRight size={16} />
    </button>
  )
}

function App() {
  const marqueeRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-image', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-image',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: marqueeRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="bg-sand text-ink">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-line px-5 py-5 sm:px-8 lg:px-12">
        <p className="text-sm uppercase tracking-[0.24em]">WebExpertsa</p>
        <p className="hidden text-xs uppercase tracking-[0.18em] text-steel sm:block">WE DESIGN. WE BUILD. WE GROW.</p>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-10 border-x border-line px-5 py-12 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-20">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-steel">Premium Digital Agency</p>
            <h1 className="text-5xl font-medium uppercase leading-[0.92] tracking-tightest sm:text-7xl lg:text-8xl">
              Building
              <br />
              digital stories
              <br />
              that sell.
            </h1>
          </motion.div>

          <motion.div
            className="flex flex-col justify-between gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={fadeUp}
          >
            <p className="max-w-md text-base leading-relaxed text-steel">
              WebExpertsa crafts modern websites, web applications, and brand experiences for teams that want to stand out online with confidence.
            </p>
            <MagneticButton />
            <div className="hero-image h-72 border border-line bg-[radial-gradient(circle_at_20%_20%,#1f1f1f_0,#101010_50%,#000_100%)] p-6 text-sand sm:h-80">
              <p className="text-xs uppercase tracking-[0.2em] text-sand/70">Featured Launch</p>
              <p className="mt-12 max-w-xs text-3xl leading-tight">Editorial commerce platform for a modern luxury brand.</p>
            </div>
          </motion.div>
        </section>

        <section className="overflow-hidden border-y border-line py-8">
          <div ref={marqueeRef} className="marquee whitespace-nowrap text-5xl font-medium uppercase tracking-tightest sm:text-7xl">
            WebExpertsa • Design & Development • UI/UX • Branding • Digital Solutions •
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl border-x border-line px-5 py-14 sm:px-8 lg:px-12">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-steel">Services</p>
            <h2 className="text-4xl uppercase leading-tight tracking-tightest sm:text-5xl">Creative + technical execution</h2>
          </motion.div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map(({ title, detail, icon: Icon }) => (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                className="border border-line p-6"
              >
                <Icon className="mb-4" size={20} />
                <h3 className="mb-3 text-2xl leading-tight">{title}</h3>
                <p className="text-steel">{detail}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl border-x border-b border-line px-5 py-14 sm:px-8 lg:px-12">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-steel">Selected Projects</p>
              <h2 className="text-4xl uppercase leading-tight tracking-tightest sm:text-5xl">Recent work</h2>
            </div>
            <Rocket size={20} className="mb-2 hidden sm:block" />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.name}
                className="group border border-line"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="case-image flex h-64 items-end bg-[linear-gradient(145deg,#2e2e2e_0%,#111_100%)] p-5 transition-transform duration-500 group-hover:scale-[1.02]">
                  <p className="text-sm uppercase tracking-[0.18em] text-sand/80">0{index + 1}</p>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-xl">{project.name}</h3>
                    <p className="text-sm text-steel">{project.category}</p>
                  </div>
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-5 border-x border-b border-line px-5 py-8 text-sm text-steel sm:flex-row sm:px-8 lg:px-12">
        <p>© {new Date().getFullYear()} WebExpertsa. Crafted for ambitious brands.</p>
        <p className="uppercase tracking-[0.15em]">hello@webexpertsa.com</p>
      </footer>
    </div>
  )
}

export default App
