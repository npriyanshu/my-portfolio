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

      // --- Phase 1: Shrink to Circle ---
      tl.to(maskRef.current, {
        width: isMobile ? "85vw" : "30vw",
        height: isMobile ? "85vw" : "30vw",
        borderRadius: "50%",
        scale: 0.5,
        y: isMobile ? "-30vh" : 100,
        border: "10px solid white",
      }, "phase1")
        .to(bgRef.current, { backgroundColor: "#3b82f6" }, "phase1")
        .to(imageRef.current, { scale: 1.5 }, "phase1")
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
        .to(bgRef.current, { backgroundColor: "#18181b" }, "phase3")
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
        .to(bgRef.current, { backgroundColor: "#000000" }, "phase4")
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
      <main className="relative w-full bg-black text-white">
        <div ref={triggerRef} className="h-screen w-full relative overflow-hidden">

          {/* Layer 1: Background & Mask */}
          <div ref={bgRef} className="absolute inset-0 bg-black z-0 flex items-center justify-center">
            <div ref={maskRef} className="w-full h-full overflow-hidden relative z-10 origin-center box-border">
              <img ref={imageRef} src="/hero.png" alt="Hero" className="w-full h-full object-contain object-top origin-center scale-100" />
            </div>
          </div>

          {/* Layer 2: UI Content */}
          <div className="hero-title absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-4">
            <h1 className="text-[12vw] md:text-[10vw] font-black uppercase leading-[0.9] text-center tracking-tighter">
              Priyanshu <br /> Negi
            </h1>
            <p className="absolute bottom-20 text-xl font-mono text-gray-400 tracking-widest uppercase">Full Stack Developer</p>
          </div>

          {/* DASHBOARD UI */}
          <div className="dashboard-ui opacity-0 translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-10 items-center md:justify-center md:items-end md:pr-24 md:pb-0">
            <div className="w-[90%] md:w-1/2 text-center md:text-right">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 uppercase tracking-tight drop-shadow-lg">Dev Stats</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left">
                <div className="bg-zinc-800/90 backdrop-blur-sm p-4 rounded-xl border border-zinc-700 shadow-xl">
                  <h3 className="text-zinc-400 font-bold text-[10px] md:text-sm tracking-wider">EXP. YEARS</h3>
                  <p className="text-2xl md:text-4xl font-mono mt-1 text-blue-400">2+</p>
                </div>
                <div className="bg-red-600/90 backdrop-blur-sm p-4 rounded-xl shadow-xl shadow-red-900/20">
                  <h3 className="text-red-200 font-bold text-[10px] md:text-sm tracking-wider">LANGUAGES</h3>
                  <p className="text-2xl md:text-4xl font-mono mt-1">5+</p>
                </div>
                <div className="col-span-2 bg-white/95 backdrop-blur-sm p-4 rounded-xl text-black shadow-xl">
                  <h3 className="text-gray-500 font-bold text-[10px] md:text-sm mb-2 tracking-wider">CORE STACK</h3>
                  <div className="flex gap-2 text-xs md:text-lg font-bold flex-wrap justify-center md:justify-end">
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">Next.js</span>
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">Python</span>
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">Docker</span>
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">AWS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT UI */}
          <div className="about-ui opacity-0 translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-12 items-center md:justify-center md:items-start md:pl-24 md:pb-0">
            <div className="w-[90%] md:w-1/2 text-center md:text-left bg-black/60 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-tight">
                BEHIND <span className="text-blue-500 block md:inline">THE CODE</span>
              </h2>
              <p className="text-gray-200 md:text-gray-400 text-sm md:text-xl mb-6 leading-relaxed font-medium md:font-normal">
                I specialize in building efficient back-end solutions and responsive user experiences. Currently mentoring junior developers and simplifying complex systems.
              </p>
              <div className="flex gap-3 justify-center md:justify-start pointer-events-auto">
                <a href="https://github.com/npriyanshu" target="_blank" rel="noreferrer" className="px-6 py-3 text-sm md:text-base border border-zinc-700 bg-zinc-900 text-white rounded-full hover:bg-white hover:text-black transition-all">
                  GitHub
                </a>
                <button className="px-6 py-3 text-sm md:text-base bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">
                  Resume
                </button>
              </div>
            </div>
          </div>

          {/* WORK UI (PROJECTS) */}
          <div className="work-ui opacity-0 translate-y-20 absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
            <h2 className="text-5xl md:text-8xl text-white mb-6 md:mb-12 uppercase font-black tracking-tighter text-center">
              Selected <span className="text-blue-500">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pointer-events-auto w-[90%] md:w-3/4 max-h-[60vh] overflow-y-auto md:overflow-visible p-2">
              
              {/* Project 1: ChatterVerse */}
              <a href="https://chatterverse-eqjz.onrender.com" target="_blank" rel="noreferrer" className="group relative aspect-video bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer border border-zinc-700 hover:border-blue-500 transition-colors shrink-0">
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold">ChatterVerse</h3>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">Next.js + SQL + Real-time Messaging</p>
                </div>
              </a>

              {/* Project 2: E-Commerce */}
              <a href="https://ecom.svinfotechsoftwaresolutions.com/public/" target="_blank" rel="noreferrer" className="group relative aspect-video bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer border border-zinc-700 hover:border-blue-500 transition-colors shrink-0">
                <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/0 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <h3 className="text-xl md:text-2xl font-bold">E-Commerce Engine</h3>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">Laravel + MySQL + Secure Payments</p>
                </div>
              </a>

            </div>
            <a href="https://github.com/npriyanshu?tab=repositories" target="_blank" rel="noreferrer" className="mt-6 md:mt-12 px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition pointer-events-auto text-sm md:text-base">
              View All Repositories
            </a>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full h-[50vh] bg-zinc-900 text-white flex flex-col items-center justify-center relative z-50">
        <h2 className="text-5xl font-black mb-6">LET'S TALK</h2>
        <p className="text-gray-400 mb-8">npriyanshu63@gmail.com</p>
        <a href="mailto:npriyanshu63@gmail.com" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition">
          Contact Me
        </a>
      </footer>
    </>
  )
}

export default App