import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

function App() {
  const triggerRef = useRef(null)
  const bgRef = useRef(null)
  const maskRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
      lenis.destroy()
    }
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
    }, (context) => {
      let { isMobile } = context.conditions;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: isMobile ? "+=4000" : "+=3000",
          scrub: 2,
          pin: true,
          pinSpacing: true,
        },
      });

      // --- Phase 1: Hero -> Dashboard ---
      tl.to(maskRef.current, {
        width: isMobile ? "85vw" : "30vw",
        height: isMobile ? "85vw" : "30vw",
        borderRadius: "50%",
        scale: 0.5,
        y: isMobile ? "-30vh" : 100,
        border: "10px solid rgba(255,255,255,0.1)", // Thinner, cleaner border
      }, "phase1")
        .to(bgRef.current, { backgroundColor: "#1e1b4b" }, "phase1") // Deep Indigo
        .to(imageRef.current, { scale: 1.5, filter: "grayscale(100%)" }, "phase1") // Cool B&W effect
        .to(".hero-title", { opacity: 0, y: -100 }, "phase1")

      // --- Phase 2: Enter Dashboard ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "-25vw",
        y: isMobile ? "-35vh" : 0,
        rotation: -10,
      }, "phase2")
        .to(".dashboard-ui", {
          opacity: 1,
          y: 0,
          duration: 1,
          pointerEvents: "all"
        }, "phase2")

      // --- Phase 3: Dashboard Exit -> About Enter ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "25vw",
        y: isMobile ? "-35vh" : 0,
        rotation: 10,
        scale: 0.6,
      }, "phase3")
        .to(bgRef.current, { backgroundColor: "#111" }, "phase3")
        .to(".dashboard-ui", {
          opacity: 0,
          y: isMobile ? -50 : 50,
          duration: 0.5
        }, "phase3")
        .to(".about-ui", {
          opacity: 1,
          y: 0,
          duration: 1
        }, "phase3+=0.5")

      // --- Phase 4: About Exit -> Work Enter ---
      tl.to(maskRef.current, { scale: 50, duration: 1 }, "phase4")
        .to(bgRef.current, { backgroundColor: "#000" }, "phase4")
        .to(".about-ui", {
          opacity: 0,
          y: 50,
          duration: 0.3
        }, "phase4")
        .to(".work-ui", {
          opacity: 1,
          y: 0,
          duration: 1,
          pointerEvents: "all"
        }, "phase4")
    });

  }, [])

  return (
    <>
      <main className="relative w-full bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
        <div ref={triggerRef} className="h-screen w-full relative overflow-hidden">

          {/* Layer 1: Background & Mask */}
          <div ref={bgRef} className="absolute inset-0 bg-black z-0 flex items-center justify-center transition-colors duration-500">
            {/* Simple Grid Pattern for texture */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            <div ref={maskRef} className="w-full h-full overflow-hidden relative z-10 origin-center box-border shadow-2xl">
              <img ref={imageRef} src="/hero.png" alt="Hero" className="w-full h-full object-contain object-top origin-center scale-100 transition-all duration-700" />
            </div>
          </div>

          {/* Layer 2: UI Content */}
          <div className="hero-title absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-4 mix-blend-difference">
            <h1 className="text-[13vw] md:text-[11vw] font-black uppercase leading-[0.8] text-center tracking-tighter">
              Priyanshu <br /> <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">Negi</span>
            </h1>
            <div className="mt-8 flex items-center gap-4 animate-pulse">
              <div className="h-px w-12 bg-white"></div>
              <p className="text-sm md:text-xl font-mono tracking-widest uppercase">Senior Web Developer</p>
              <div className="h-px w-12 bg-white"></div>
            </div>
          </div>

          {/* DASHBOARD UI */}
          <div className="dashboard-ui opacity-0 translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-10 items-center md:justify-center md:items-end md:pr-24 md:pb-0">
            <div className="w-[90%] md:w-1/2 text-center md:text-right">
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                Dev Arsenal
              </h2>

              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left">
                {/* Stats Card */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all group">
                  <h3 className="text-gray-400 font-bold text-xs tracking-widest mb-2 group-hover:text-blue-400">EXPERIENCE</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-mono text-white">2+</p>
                    <span className="text-xs text-gray-500">YEARS</span>
                  </div>
                </div>

                {/* Rating Card */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all group">
                  <h3 className="text-gray-400 font-bold text-xs tracking-widest mb-2 group-hover:text-purple-400">TOP SKILL</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl md:text-2xl font-bold text-white">Next.js</p>
                    <span className="text-xs text-green-400 font-mono">★★★★</span>
                  </div>
                </div>

                {/* Stack Card */}
                <div className="col-span-2 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                  <h3 className="text-gray-400 font-bold text-xs tracking-widest mb-4">CORE TECHNOLOGIES</h3>
                  <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                    {["Next.js", "Python", "Docker", "AWS", "SQL"].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-black/50 border border-white/20 rounded-full text-xs md:text-sm font-medium hover:bg-white hover:text-black transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT UI */}
          <div className="about-ui opacity-0 translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-12 items-center md:justify-center md:items-start md:pl-24 md:pb-0">
            <div className="w-[90%] md:w-[45%] text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-black mb-6 leading-none">
                SIMPLIFYING <br /> <span className="text-purple-500">COMPLEXITY</span>
              </h2>

              <div className="bg-zinc-900/80 backdrop-blur-md p-6 rounded-2xl border-l-4 border-purple-500 mb-8">
                <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                  "I focus on user experiences and efficient back-end solutions, thrive in collaboration, and explore new technologies for impactful results."
                </p>
              </div>

              <div className="flex gap-4 justify-center md:justify-start pointer-events-auto">
                <a href="https://github.com/npriyanshu" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all group">
                  <span>GitHub</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-purple-500 hover:text-white transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Download CV
                </button>
              </div>
            </div>
          </div>

          {/* WORK UI (UPDATED WITH RESUME PROJECTS) */}
          <div className="work-ui opacity-0 translate-y-20 absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
            <p className="text-blue-500 font-mono text-sm tracking-widest mb-4 uppercase">Latest Deployments</p>
            <h2 className="text-5xl md:text-8xl text-white mb-8 md:mb-12 uppercase font-black tracking-tighter text-center">
              Selected <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-500">Works</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto w-[90%] md:w-3/4 max-h-[60vh] overflow-y-auto md:overflow-visible p-2">

              {/* Project 1: ChatterVerse [cite: 67] */}
              <a href="https://chatter-verse-sage.vercel.app/" target="_blank" rel="noreferrer" className="group relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-blue-500 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] shrink-0">
                {/* Abstract Project BG */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 to-black"></div>

                <div className="absolute bottom-0 left-0 p-6 w-full bg-linear-to-t from-black to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">ChatterVerse</h3>
                      <p className="text-gray-400 text-sm mt-1">Next.js • SQL • Real-time Voice</p>
                    </div>
                    <span className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">↗</span>
                  </div>
                </div>
              </a>

              {/* Project 2: The Commons Voice [cite: 72] */}
              <a href="https://thecommonsvoice.com" target="_blank" rel="noreferrer" className="group relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-purple-500 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] shrink-0">
                {/* Abstract Project BG */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 to-black"></div>

                <div className="absolute bottom-0 left-0 p-6 w-full bg-linear-to-t from-black to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">The Commons Voice</h3>
                      <p className="text-gray-400 text-sm mt-1">News Portal • SEO • Dynamic UI</p>
                    </div>
                    <span className="h-8 w-8 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">↗</span>
                  </div>
                </div>
              </a>

            </div>

            <a href="https://github.com/npriyanshu" target="_blank" rel="noreferrer" className="mt-8 px-8 py-3 bg-white/5 border border-white/20 rounded-full hover:bg-white hover:text-black transition pointer-events-auto backdrop-blur-md">
              View All Repositories
            </a>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full h-[50vh] bg-black text-white flex flex-col items-center justify-center relative z-50 border-t border-white/10">
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-center">
          READY TO <span className="text-gray-500">SCALE?</span>
        </h2>
        <p className="text-gray-400 mb-8 font-mono">npriyanshu63@gmail.com</p>
        <a href="mailto:npriyanshu63@gmail.com" className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-105">
          <span className="relative z-10 group-hover:text-white transition-colors">Start a Conversation</span>
          <div className="absolute inset-0 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300"></div>
        </a>
      </footer>
    </>
  )
}

export default App