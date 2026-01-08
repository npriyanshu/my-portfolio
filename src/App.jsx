import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

function App() {
  // RENAME: 'triggerRef' is the specific element we want to lock/pin
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
          // CHANGE: We trigger the INNER div, not the outer main
          trigger: triggerRef.current, 
          start: "top top",
          end: "+=3000", 
          scrub: 2, 
          pin: true,
          // pinSpacing: true, 
        },
      });

      // ... (All your animation logic stays exactly the same) ...
      // --- Phase 1 ---
      tl.to(maskRef.current, {
        width: isMobile ? "75vw" : "30vw",
        height: isMobile ? "75vw" : "30vw",
        borderRadius: "50%",
        scale: 0.5,
        y: isMobile ? "-20vh" : 100,
        border: "10px solid white",
      }, "phase1")
      .to(bgRef.current, { backgroundColor: "#3b82f6" }, "phase1")
      .to(imageRef.current, { scale: 1.5 }, "phase1")
      .to(".hero-title", { opacity: 0, y: -100 }, "phase1")

      // --- Phase 2 ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "-25vw",
        y: isMobile ? "-20vh" : 0,
        rotation: -10,
      }, "phase2")
      .to(".dashboard-ui", { opacity: 1, y: 0, duration: 1, pointerEvents: "all" }, "phase2")

      // --- Phase 3 ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "25vw",
        y: isMobile ? "-20vh" : 0,
        rotation: 10,
        scale: 0.6,
      }, "phase3")
      .to(bgRef.current, { backgroundColor: "#18181b" }, "phase3")
      .to(".dashboard-ui", { opacity: 0, y: 50 }, "phase3")
      .to(".about-ui", { opacity: 1, y: 0, duration: 1 }, "phase3")

      // --- Phase 4 ---
      tl.to(maskRef.current, { scale: 50, duration: 1 }, "phase4")
      .to(bgRef.current, { backgroundColor: "#000000" }, "phase4")
      .to(".about-ui", { opacity: 0, y: 50, duration: 0.3 }, "phase4")
      .to(".work-ui", { opacity: 1, y: 0, duration: 1, pointerEvents: "all" }, "phase4")
    });

  }, [])

  return (
    <>
      {/* OUTER WRAPPER: Just a layout block. 
         It doesn't care about animations. It just sits in the document flow.
      */}
      <main className="relative w-full bg-black text-white">
        
        {/* INNER TRIGGER: This is the 'Track'.
           GSAP pins THIS element. 
           We use 'h-screen' so it fills the viewport perfectly while pinned.
        */}
        <div ref={triggerRef} className="h-screen w-full relative overflow-hidden">
          
          {/* Layer 1: Background & Mask */}
          <div ref={bgRef} className="absolute inset-0 bg-black z-0 flex items-center justify-center">
            <div ref={maskRef} className="w-full h-full overflow-hidden relative z-10 origin-center box-border">
              <img ref={imageRef} src="/hero.png" alt="Hero" className="w-full h-full object-contain object-top origin-center scale-100" />
            </div>
          </div>

          {/* Layer 2: UI Content */}
          <div className="hero-title absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-4">
            <h1 className="text-[14vw] md:text-[10vw] font-black uppercase leading-[0.9] text-center tracking-tighter">
              Full Stack <br /> Developer
            </h1>
          </div>

          {/* ... DASHBOARD UI (Same as before) ... */}
          <div className="dashboard-ui opacity-0 translate-y-10 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-12 items-center md:justify-center md:items-end md:pr-24 md:pb-0">
             {/* ... content ... */}
             <div className="w-[90%] md:w-1/2 text-center md:text-right">
              <h2 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 uppercase tracking-tight">My Stats</h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left">
                <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 shadow-xl">
                  <h3 className="text-zinc-400 font-bold text-[10px] md:text-sm tracking-wider">COMMITS</h3>
                  <p className="text-xl md:text-4xl font-mono mt-1 text-blue-400">1,240</p>
                </div>
                <div className="bg-red-600 p-4 rounded-xl shadow-xl shadow-red-900/20">
                  <h3 className="text-red-200 font-bold text-[10px] md:text-sm tracking-wider">PROJECTS</h3>
                  <p className="text-xl md:text-4xl font-mono mt-1">14</p>
                </div>
                <div className="col-span-2 bg-white p-4 rounded-xl text-black shadow-xl">
                  <h3 className="text-gray-500 font-bold text-[10px] md:text-sm mb-2 tracking-wider">CURRENT STACK</h3>
                  <div className="flex gap-2 text-xs md:text-lg font-bold flex-wrap justify-center md:justify-end">
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">React</span>
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">Next.js</span>
                    <span className="bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">AWS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ... ABOUT UI (Same as before) ... */}
          <div className="about-ui opacity-0 translate-y-10 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-12 items-center md:justify-center md:items-start md:pl-24 md:pb-0">
             {/* ... content ... */}
             <div className="w-[90%] md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-tight">
                BEHIND <span className="text-blue-500 block md:inline">THE CODE</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-xl mb-6 leading-relaxed">
                I don't just write code; I build immersive web experiences. Currently obsessed with <span className="text-white font-bold">3D WebGL</span>.
              </p>
              <div className="flex gap-3 justify-center md:justify-start pointer-events-auto">
                <button className="px-6 py-3 text-sm md:text-base border border-zinc-700 bg-zinc-900 rounded-full hover:bg-white hover:text-black transition-all">GitHub</button>
                <button className="px-6 py-3 text-sm md:text-base bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/50">LinkedIn</button>
              </div>
            </div>
          </div>

          {/* ... WORK UI (Same as before) ... */}
          <div className="work-ui opacity-0 translate-y-10 absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
             {/* ... content ... */}
             <h2 className="text-4xl md:text-8xl text-white mb-8 md:mb-12 uppercase">
              Selected <span className="text-blue-500">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pointer-events-auto w-[90%] md:w-3/4">
              <div className="group relative aspect-video bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer border border-zinc-700 hover:border-blue-500 transition-colors">
                <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold">E-Commerce Core</h3>
                  <p className="text-gray-400 text-sm mt-1">Next.js + Stripe + Redis</p>
                </div>
              </div>
              <div className="group relative aspect-video bg-zinc-800 rounded-2xl overflow-hidden cursor-pointer border border-zinc-700 hover:border-blue-500 transition-colors">
                <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/0 transition-colors"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-bold">AI Dashboard</h3>
                  <p className="text-gray-400 text-sm mt-1">React + Python + AWS</p>
                </div>
              </div>
            </div>
            <button className="mt-8 md:mt-12 px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition pointer-events-auto">View All Projects</button>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full h-[50vh] bg-zinc-900 text-white flex flex-col items-center justify-center relative z-50">
        <h2 className="text-5xl font-black mb-6">LET'S TALK</h2>
        <p className="text-gray-400 mb-8">Have a project in mind?</p>
        <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition">
          Contact Me
        </button>
      </footer>
    </>
  )
}

export default App