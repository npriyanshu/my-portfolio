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

  const projects = [
     {
      title: "BraiinyBear",
      subtitle: "EdTech Platform • Organization",
      url: "https://braiinybear.org",
      color: "from-green-500 to-emerald-400",
      bg: "bg-zinc-800"
    },
    {
      title: "The Commons Voice",
      subtitle: "News Portal • SEO • Dynamic UI",
      url: "https://thecommonsvoice.com",
      color: "from-purple-600 to-pink-500",
      bg: "bg-zinc-800"
    },
    {
      title: "Urbanic Pitara",
      subtitle: "E-Commerce • Shopify/Custom",
      url: "https://urbanicpitara.com",
      color: "from-orange-500 to-red-500",
      bg: "bg-zinc-900"
    },
     {
      title: "ChatterVerse",
      subtitle: "Next.js • Real-time Voice • Prisma",
      url: "https://chatter-verse-sage.vercel.app/",
      color: "from-blue-600 to-cyan-500",
      bg: "bg-zinc-900"
    }
   
  ]

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
          end: isMobile ? "+=4500" : "+=4000", 
          scrub: 1.5, 
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
        border: "1px solid rgba(255,255,255,0.2)",
      }, "phase1")
        .to(bgRef.current, { backgroundColor: "#172554" }, "phase1") 
        .to(imageRef.current, { scale: 1.5, filter: "grayscale(100%)" }, "phase1")
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
        .to(bgRef.current, { backgroundColor: "#0f0f0f" }, "phase3")
        .to(".dashboard-ui", {
          opacity: 0,
          y: isMobile ? -50 : 50,
          duration: 0.5
        }, "phase3")
        .to(".about-ui", {
          opacity: 1,
          y: 0,
          duration: 0.8
        }, "phase3+=0.3")

      // --- Phase 4: About Exit -> Work Enter ---
      
      // Step A: Move About Out
      tl.to(".about-ui", { opacity: 0, y: -50, duration: 0.4 }, "phase4_start")
      
      // Step B: Scale Background Up
      .to(maskRef.current, { scale: 50, duration: 1 }, "phase4_start+=0.1")
      .to(bgRef.current, { backgroundColor: "#000000" }, "phase4_start+=0.1")
      
      // Step C: Reveal Works Container
      .to(".work-ui", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        pointerEvents: "all"
      }, "phase4_start+=0.1")
      
      // Step D: Cards Animation (FIXED)
      .to(".project-card", {
        y: (index) => index * (isMobile ? 40 : 60), 
        opacity: 1,
        duration: 1, 
        stagger: 0, // FIX: Set to 0. All cards move together as a block.
        ease: "power2.out"
      }, "phase4_start+=0.2")

      // Step E: Padding for scroll
      .to({}, { duration: 1 }) 
    });

  }, [])

  return (
    <>
      <main className="relative w-full bg-black text-white font-sans selection:bg-indigo-500 selection:text-white">
        <div ref={triggerRef} className="h-screen w-full relative overflow-hidden">

          {/* Layer 1: Background & Mask */}
          <div ref={bgRef} className="absolute inset-0 bg-black z-0 flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
             </div>
             <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-black/80"></div>

            <div ref={maskRef} className="w-full h-full overflow-hidden relative z-10 origin-center box-border shadow-2xl">
              <img ref={imageRef} src="/hero.png" alt="Hero" className="w-full h-full object-contain object-top origin-center scale-100" />
            </div>
          </div>

          {/* Layer 2: UI Content */}
          <div className="hero-title absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-4 mix-blend-screen">
            <h1 className="text-[13vw] md:text-[11vw] font-black uppercase leading-[0.8] text-center tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-600 drop-shadow-lg">
              Priyanshu <br /> Negi
            </h1>
            <div className="mt-8 flex items-center gap-4">
                <div className="h-px w-8 md:w-16 bg-linear-to-r from-transparent to-white"></div>
                <p className="text-xs md:text-xl font-mono tracking-[0.2em] text-blue-200 uppercase glow-text">Full Stack Engineer</p>
                <div className="h-px w-8 md:w-16 bg-linear-to-l from-transparent to-white"></div>
            </div>
          </div>

          {/* DASHBOARD UI */}
          <div className="dashboard-ui opacity-0 translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-10 items-center md:justify-center md:items-end md:pr-24 md:pb-0">
            <div className="w-[90%] md:w-1/2 text-center md:text-right">
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Dev Arsenal
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                  <h3 className="text-blue-300 font-bold text-xs tracking-widest mb-2">EXPERIENCE</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-mono text-white">2+</p>
                    <span className="text-xs text-gray-400">YEARS</span>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                  <h3 className="text-purple-300 font-bold text-xs tracking-widest mb-2">SKILLS</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl md:text-2xl font-bold text-white">Next.js</p>
                    <span className="text-xs text-green-400 font-mono">★★★★</span>
                  </div>
                </div>
                <div className="col-span-2 bg-linear-to-r from-white/10 to-transparent backdrop-blur-md p-6 rounded-2xl border border-white/10">
                  <h3 className="text-gray-400 font-bold text-xs tracking-widest mb-4">CORE STACK</h3>
                  <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                    {["Next.js", "Node.js", "NestJS", "Prisma", "Docker", "AWS"].map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-black/40 border border-white/10 rounded-full text-xs md:text-sm text-gray-200">
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
            <div className="w-[90%] md:w-[45%] text-center md:text-left bg-black/40 md:bg-transparent p-6 rounded-2xl backdrop-blur-xl border border-white/5 md:border-none">
              <h2 className="text-4xl md:text-7xl font-black mb-6 leading-none">
                SIMPLIFYING <br/> <span className="text-indigo-500">COMPLEXITY</span>
              </h2>
              <div className="pl-4 border-l-2 border-indigo-500 mb-8">
                  <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                    "I focus on user experiences and efficient back-end solutions, thrive in collaboration, and explore new technologies for impactful results."
                  </p>
              </div>
              <div className="flex gap-4 justify-center md:justify-start pointer-events-auto">
                <a href="https://github.com/npriyanshu" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all group">
                  <span>GitHub</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-colors">
                  Resume
                </button>
              </div>
            </div>
          </div>

          {/* SELECTED WORKS */}
          <div className="work-ui opacity-0 absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-between py-12 md:py-20 h-full">
            
            <h2 className="text-4xl md:text-7xl text-white uppercase font-black tracking-tighter text-center shrink-0">
              Selected <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-500">Works</span>
            </h2>
            
            <div className="relative w-[90%] md:w-[600px] grow flex items-center justify-center pointer-events-auto">
              
              <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
                {projects.map((project, index) => (
                  <a 
                    key={index}
                    href={project.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`project-card absolute top-0 left-0 w-full h-[250px] md:h-[300px] rounded-3xl border border-white/10 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-4 hover:shadow-blue-500/20 cursor-pointer translate-y-[150vh] ${project.bg}`}
                    style={{
                      zIndex: index + 10, 
                    }}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${project.color}`}></div>
                    <div className="flex justify-between items-start">
                      <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h3>
                          <p className="text-gray-400 font-mono text-sm">{project.subtitle}</p>
                      </div>
                      <span className="bg-white/10 p-3 rounded-full text-white">↗</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  </a>
                ))}
              </div>

            </div>
            
            <a href="https://github.com/npriyanshu" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-white border-b border-transparent hover:border-white transition-colors pointer-events-auto shrink-0 mt-4">
              View All Projects on GitHub
            </a>
          </div>

        </div>
      </main>

      <footer className="w-full h-[50vh] bg-black text-white flex flex-col items-center justify-center relative z-50 border-t border-white/10">
        <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-center opacity-30 hover:opacity-100 transition-opacity cursor-default">
            LET'S BUILD
        </h2>
        <p className="text-gray-400 mb-8 font-mono">npriyanshu63@gmail.com</p>
        <a href="mailto:npriyanshu63@gmail.com" className="group relative px-10 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-110">
          <span className="relative z-10 group-hover:text-white transition-colors">Start a Project</span>
          <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300"></div>
        </a>
      </footer>
    </>
  )
}

export default App