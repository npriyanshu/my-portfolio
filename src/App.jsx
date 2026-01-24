import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

// --- UTILITY: 3D Tilt Card Component ---
// --- UTILITY: 3D Tilt Card Component ---
const TiltCard = ({ children, className, style }) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 20;
    gsap.to(ref.current, { rotationY: x, rotationX: -y, transformPerspective: 1000, duration: 0.5 });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { rotationY: 0, rotationX: 0, duration: 0.5 });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} style={style}>
      {children}
    </div>
  );
};

// --- UTILITY: Magnetic Button Component ---
const MagneticButton = ({ children, className, onClick }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2));
    const y = (e.clientY - (top + height / 2));

    gsap.to(btnRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 1,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// --- UTILITY: Tech Logo Component ---
const TechLogo = ({ name, url, invert = false, className = "w-8 h-8 md:w-10 md:h-10" }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className={`p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all ${invert ? "invert" : ""}`}>
      <img src={url} alt={name} className={`${className} object-contain opacity-80 group-hover:opacity-100 transition-opacity`} />
    </div>
    <span className="text-[10px] md:text-xs text-gray-500 font-mono opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
      {name}
    </span>
  </div>
);

function App() {
  const triggerRef = useRef(null)
  const bgRef = useRef(null)
  const maskRef = useRef(null)
  const imageRef = useRef(null)
  const orbsRef = useRef(null)
  const workContainerRef = useRef(null) // NEW: Ref for the horizontal container

  const projects = [
    {
      title: "BraiinyBear",
      subtitle: "EdTech Platform • Organization",
      role: "Lead Developer",
      impact: "Scaled to 500+ students",
      techStack: ["React", "Node", "MongoDB"],
      url: "https://braiinybear.org",
      color: "from-green-500 to-emerald-400",
      bg: "bg-zinc-800"
    },
    {
      title: "The Commons Voice",
      subtitle: "News Portal • SEO • Dynamic UI",
      role: "Frontend Architect",
      impact: "Reduced load time by 40%",
      techStack: ["Next.js", "Redis", "Tailwind"],
      url: "https://thecommonsvoice.com",
      color: "from-purple-600 to-pink-500",
      bg: "bg-zinc-800"
    },
    {
      title: "Urbanic Pitara",
      subtitle: "E-Commerce • Shopify/Custom",
      role: "Full Stack Engineer",
      impact: "Boosted sales by 25%",
      techStack: ["Shopify", "Liquid", "React"],
      url: "https://urbanicpitara.com",
      color: "from-orange-500 to-red-500",
      bg: "bg-zinc-900"
    },
    {
      title: "ChatterVerse",
      subtitle: "Next.js • Real-time Voice • Prisma",
      role: "Solo Developer",
      impact: "Real-time voice < 50ms latency",
      techStack: ["Next.js", "WebRTC", "Prisma"],
      url: "https://chatter-verse-sage.vercel.app/",
      color: "from-blue-600 to-cyan-500",
      bg: "bg-zinc-900"
    }
  ]

  useEffect(() => {
    // --- PHYSICS CONFIGURATION (PRESERVED) ---
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(1000, 16)

    // Orb Float Animation
    if (orbsRef.current) {
      gsap.to(".orb", {
        y: "random(-100, 100)",
        x: "random(-100, 100)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2
      })
    }

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
    }
  }, [])

  useGSAP(() => {
    // --- INTRO ANIMATION ---
    gsap.from(".name-char", {
      yPercent: 100,
      duration: 1.5,
      ease: "power4.out",
      stagger: 0.1,
      delay: 0.2
    });

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
          end: isMobile ? "+=15000" : "+=18000", // EXTENDED TIMELINE
          scrub: 2,
          pin: true,
          pinSpacing: true,
        },
        defaults: { ease: "power2.inOut" }
      });

      // --- Phase 1: Hero -> Dashboard ---
      tl.to(maskRef.current, {
        width: isMobile ? "85vw" : "30vw",
        height: isMobile ? "85vw" : "30vw",
        borderRadius: "50%",
        scale: 0.5,
        y: isMobile ? "-30vh" : 100,
        border: "1px solid rgba(255,255,255,0.2)",
        ease: "power3.inOut"
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
          autoAlpha: 1,
          y: 0,
          duration: 1,
        }, "phase2")
        .from(".stat-number", {
          textContent: 0,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          stagger: 0.2,
        }, "phase2+=0.5")

      // --- Phase 3: Dashboard Exit -> About Enter ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "25vw",
        y: isMobile ? "-35vh" : 0,
        rotation: 10,
        scale: 0.6,
      }, "phase3")
        .to(bgRef.current, { backgroundColor: "#0f0f0f" }, "phase3")
        .to(".dashboard-ui", {
          autoAlpha: 0,
          y: isMobile ? -50 : 50,
        }, "phase3")
        .to(".about-ui", {
          autoAlpha: 1,
          y: 0,
        }, "phase3+=0.3")

      // --- Phase 4: About Exit -> Process Enter ---
      tl.to(".about-ui", { autoAlpha: 0, y: -50 }, "phase4")
        .to(maskRef.current, { scale: 0.4, x: 0, y: -50, rotation: 180, borderRadius: "20%" }, "phase4")
        .to(bgRef.current, { backgroundColor: "#111" }, "phase4")
        .to(".process-ui", { autoAlpha: 1 }, "phase4+=0.5")
        .from(".process-step", {
          opacity: 0,
          y: 20,
          stagger: 0.5
        }, "phase4+=1")

      // --- Phase 5: Process Exit -> Playground Enter ---
      tl.to(".process-ui", { autoAlpha: 0, scale: 0.9 }, "phase5")
        .to(maskRef.current, {
          scale: 2,
          rotation: 0,
          borderRadius: "0%",
          width: "100%",
          height: "100%",
          opacity: 0.1
        }, "phase5")
        .to(bgRef.current, { backgroundColor: "#050505" }, "phase5")
        .to(".playground-ui", { autoAlpha: 1, y: 0 }, "phase5+=0.5")

      // --- Phase 6: Playground Exit -> Testimonials Enter ---
      tl.to(".playground-ui", { autoAlpha: 0, y: -50 }, "phase6")
        .to(".testimonials-ui", { autoAlpha: 1, x: 0 }, "phase6+=0.5")
        .from(".testimonial-card", { x: "100vw", stagger: 0.2, duration: 2, ease: "power2.out" }, "phase6+=0.5")

      // --- Phase 7: Testimonials Exit -> Work Enter ---
      tl.to(".testimonials-ui", { autoAlpha: 0, scale: 0.8, y: -100 }, "phase7")
        .to(maskRef.current, { opacity: 0 }, "phase7") // Hide Hero Img completely
        .to(bgRef.current, { backgroundColor: "#000000" }, "phase7")
        .to(".work-ui", {
          autoAlpha: 1,
          y: 0,
          pointerEvents: "all"
        }, "phase7")
        // Title Slam Effect
        .from(".work-title", {
          scale: 3,
          opacity: 0,
          blur: 10,
          y: 100,
          duration: 1,
          ease: "expo.out"
        }, "phase7+=0.2")
        // Cards Staggered Pop-up
        .from(".project-card", {
          y: 300,
          opacity: 0,
          rotationX: 45,
          scale: 0.5,
          stagger: 0.1,
          duration: 1.5,
          ease: "back.out(1.2)"
        }, "phase7+=0.5")
        // Horizontal Scroll
        .fromTo(workContainerRef.current,
          { x: isMobile ? "0vw" : "0vw" },
          {
            x: isMobile ? "-300vw" : "-160vw",
            duration: 5, // Increased duration for smoother read
            ease: "none"
          },
          "phase7+=1.5")
    });

  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        .font-editorial { font-family: "Playfair Display", serif; font-style: italic; }
      `}</style>

      <main className="relative w-full bg-black text-white font-sans selection:bg-indigo-500 selection:text-white">

        {/* GLOBAL NOISE OVERLAY */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-20 mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        <div ref={triggerRef} className="h-screen md:h-dvh w-full relative overflow-hidden">

          {/* Layer 1: Background, Orbs & Mask */}
          <div ref={bgRef} className="absolute inset-0 bg-black z-0 flex items-center justify-center overflow-hidden">

            <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="orb absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-purple-600/30 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
              <div className="orb absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
            </div>

            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(#ffffff33 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div ref={maskRef} className="w-full h-full overflow-hidden relative z-10 origin-center box-border shadow-2xl will-change-transform bg-gray-900">
              <img ref={imageRef} src="/hero.png" alt="Priyanshu Negi" className="w-full h-full object-contain object-top origin-center scale-100" />
            </div>
          </div>

          {/* Layer 2: HERO UI */}
          {/* Layer 2: HERO UI */}
          <div className="hero-title absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-4 mix-blend-screen will-change-transform">
            {/* Status Dot */}
            <div className="absolute top-24 md:top-10 right-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-green-300 uppercase tracking-wider">Available for Freelance</span>
            </div>

            <h1 className="text-[13vw] md:text-[11vw] font-black uppercase leading-[0.8] text-center tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-600 drop-shadow-lg">
              Priyanshu <br /> <span className="font-editorial font-thin text-white">Negi</span>
            </h1>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-8 md:w-16 bg-linear-to-r from-transparent to-white"></div>
              <p className="text-xs md:text-xl font-mono tracking-[0.2em] text-blue-200 uppercase glow-text">Crafting pixel-perfect digital experiences</p>
              <div className="h-px w-8 md:w-16 bg-linear-to-l from-transparent to-white"></div>
            </div>

            {/* Location Badge */}
            <div className="mt-6 flex items-center gap-2 opacity-60">
              <span className="text-sm font-mono text-gray-300">Based in India 🇮🇳</span>
            </div>
          </div>

          {/* DASHBOARD UI */}
          {/* DASHBOARD UI */}
          <div className="dashboard-ui opacity-0 invisible translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-10 items-center md:items-end md:justify-center md:pr-10 lg:pr-24">
            <div className="w-[90%] md:w-auto md:max-w-2xl text-center md:text-right">
              <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Dev Arsenal
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/10 transition-colors">
                  <h3 className="text-blue-300 font-bold text-xs tracking-widest mb-4">CURRENTLY LEARNING</h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    <TechLogo name="Kafka" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" invert />
                    <div>
                      <p className="text-sm md:text-base font-bold text-white leading-tight">Kafka & <br /> Scalable Systems</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg group hover:bg-white/10 transition-colors">
                  <h3 className="text-purple-300 font-bold text-xs tracking-widest mb-2">GITHUB STATS</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-mono text-white stat-number">450</span>
                    <span className="text-3xl md:text-4xl font-mono text-white">+</span>
                    <span className="text-xs text-gray-400">COMMITS (2024)</span>
                  </div>
                </div>
                <div className="col-span-2 bg-linear-to-r from-white/10 to-transparent backdrop-blur-md p-6 rounded-2xl border border-white/10">
                  <h3 className="text-gray-400 font-bold text-xs tracking-widest mb-6">ENGINEERING ARSENAL</h3>
                  <div className="flex gap-4 flex-wrap justify-between md:justify-start">
                    <TechLogo name="Next.js" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" invert />
                    <TechLogo name="React" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" />
                    <TechLogo name="Node.js" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
                    <TechLogo name="TypeScript" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" />
                    <TechLogo name="Tailwind" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" />
                    <TechLogo name="Three.js" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" invert={true} />
                    <TechLogo name="Prisma" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg" invert />
                    <TechLogo name="Docker" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" />
                    <TechLogo name="Redis" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" />
                    <TechLogo name="PostgreSQL" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" />
                    <TechLogo name="MongoDB" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" />
                    <TechLogo name="GraphQL" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" invert />
                    <TechLogo name="Git" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" />
                    <TechLogo name="AWS" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" className="w-12 h-12" invert />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT UI */}
          <div className="about-ui opacity-0 invisible translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-12 items-center md:items-start md:justify-center md:pl-10 lg:pl-24">
            <div className="w-[90%] md:w-auto md:max-w-2xl text-center md:text-left bg-black/40 md:bg-transparent p-6 rounded-2xl backdrop-blur-xl border border-white/5 md:border-none">
              <h2 className="text-4xl md:text-7xl font-black mb-6 leading-none">
                SIMPLIFYING <br /> <span className="text-indigo-400 font-editorial">Complexity</span>
              </h2>
              <div className="pl-4 border-l-2 border-indigo-500 mb-8">
                <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-4">
                  "I focus on user experiences and efficient back-end solutions, thrive in collaboration, and explore new technologies for impactful results."
                </p>
                <h4 className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3">Toolkit</h4>
                <div className="flex gap-3 mb-6">
                  <TechLogo name="VS Code" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" />
                  <TechLogo name="AWS" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" className="w-10 h-10" invert />
                  <TechLogo name="Postman" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" />
                  <TechLogo name="Docker" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" />
                </div>

                <h4 className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-3">Personal Hobbies</h4>
                <div className="flex gap-3">
                  <TechLogo name="Gaming" url="https://cdn-icons-png.flaticon.com/128/141/141073.png" invert />
                  <TechLogo name="Music" url="https://cdn-icons-png.flaticon.com/128/2995/2995101.png" invert />
                  <TechLogo name="Movies" url="https://cdn-icons-png.flaticon.com/128/4221/4221484.png" invert />
                </div>
              </div>
              <div className="flex gap-4 justify-center md:justify-start pointer-events-auto">
                <MagneticButton className="flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all group" onClick={() => window.open("https://github.com/npriyanshu", "_blank")}>
                  <span>GitHub</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </MagneticButton>
                <MagneticButton className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-indigo-500 hover:text-white transition-colors" onClick={() => { }}>
                  Resume
                </MagneticButton>
              </div>
            </div>
          </div>


          {/* PROCESS UI */}
          <div className="process-ui opacity-0 invisible absolute inset-0 z-30 pointer-events-none flex flex-col justify-center items-center backdrop-blur-sm">
            <h2 className="text-4xl md:text-8xl font-black text-white mb-8 md:mb-16 tracking-tighter text-center">THE PROCESS</h2>
            <div className="flex flex-col gap-4 md:gap-8 w-[90%] max-w-4xl pointer-events-auto">
              {[
                { id: "01", title: "Discovery", desc: "Understanding the core problem and user needs." },
                { id: "02", title: "Architecture", desc: "Designing scalable and robust systems." },
                { id: "03", title: "Build", desc: "Crafting clean, maintained, and efficient code." },
                { id: "04", title: "Deploy", desc: "Shipping with CI/CD and automated monitoring." }
              ].map((step, i) => (
                <div key={step.id} className="process-step flex items-start md:items-center gap-4 md:gap-8 p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                  <span className="text-2xl md:text-5xl font-mono text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500 font-bold">{step.id}</span>
                  <div>
                    <h3 className="text-xl md:text-3xl font-bold text-white">{step.title}</h3>
                    <p className="text-sm md:text-base text-gray-400 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PLAYGROUND UI */}
          <div className="playground-ui opacity-0 invisible absolute inset-0 z-30 pointer-events-none flex flex-col justify-center items-center">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight">LAB / PLAYGROUND</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pointer-events-auto">
              <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-6 shadow-2xl">
                <p className="text-gray-400 font-mono text-sm uppercase">Magnetic Interaction</p>
                <MagneticButton className="px-8 py-4 bg-indigo-600 rounded-full text-white font-bold shadow-lg shadow-indigo-500/30">
                  HOVER ME
                </MagneticButton>
              </div>
              <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-6 shadow-2xl overflow-hidden relative">
                <p className="text-gray-400 font-mono text-sm uppercase">Glitch Effect</p>
                <button className="px-8 py-4 border border-green-500 text-green-500 font-mono font-bold hover:bg-green-500 hover:text-black transition-all duration-100 uppercase tracking-widest relative overflow-hidden group">
                  <span className="relative z-10">System_Check</span>
                </button>
              </div>
            </div>
          </div>

          {/* TESTIMONIALS UI */}
          <div className="testimonials-ui opacity-0 invisible absolute inset-0 z-30 pointer-events-none flex flex-col justify-center items-center px-4">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center">VOUCHED BY</h2>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-[90%] md:w-auto max-w-6xl pointer-events-auto">
              {[
                { name: "Sarah L.", role: "Product Manager", text: "Priyanshu transports designs into reality with pixel-perfect precision." },
                { name: "David K.", role: "CTO, TechFlow", text: "One of the most efficient engineers I've worked with. Clean code, fast delivery." }
              ].map((t, i) => (
                <div key={i} className="testimonial-card p-8 bg-linear-to-br from-white/10 to-transparent border border-white/5 rounded-2xl md:w-[25vw]">
                  <p className="text-lg md:text-xl text-gray-200 italic mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold">{t.name[0]}</div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{t.name}</h4>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SELECTED WORKS (HORIZONTAL SCROLL) */}
          <div className="work-ui opacity-0 invisible absolute inset-0 z-40 pointer-events-none flex flex-col justify-center h-full overflow-hidden">

            <div className="container mx-auto px-6 mb-8 md:mb-12">
              <h2 className="work-title text-4xl md:text-8xl text-white uppercase font-black tracking-tighter">
                Selected <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-500 font-editorial font-thin italic px-2">Works</span>
              </h2>
            </div>

            {/* HORIZONTAL TRACK */}
            <div
              ref={workContainerRef}
              className="flex gap-8 md:gap-12 px-6 md:px-24 w-max pointer-events-auto will-change-transform"
            >
              {projects.map((project, index) => (
                <TiltCard
                  key={index}
                  className="project-card relative w-[80vw] md:w-150 h-[50vh] md:h-[60vh] shrink-0"
                  style={{ zIndex: index + 10 }}
                >
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full h-full rounded-3xl border border-white/10 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] p-8 md:p-12 flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/20 ${project.bg}`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${project.color}`}></div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-mono font-bold tracking-widest bg-white/10 rounded-full text-white/80">{project.role}</span>
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{project.title}</h3>
                        <p className="text-gray-400 font-medium text-sm md:text-lg">{project.subtitle}</p>
                      </div>
                      <span className="bg-white/10 p-4 rounded-full text-white group-hover:rotate-45 transition-transform text-xl">↗</span>
                    </div>

                    <div className="mt-auto">
                      <div className="mb-6 pl-4 border-l border-white/30">
                        <p className="text-gray-300 italic text-sm md:text-base">"{project.impact}"</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack?.map((tech) => (
                          <span key={tech} className="px-2 py-1 text-[10px] md:text-xs border border-white/10 rounded-md text-gray-400 uppercase tracking-wider">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                </TiltCard>
              ))}
            </div>

            <a href="https://github.com/npriyanshu" target="_blank" rel="noreferrer" className="absolute bottom-10 right-10 text-sm text-gray-500 hover:text-white border-b border-transparent hover:border-white transition-colors pointer-events-auto">
              View All Projects on GitHub
            </a>
          </div>

        </div>
      </main>

      <footer className="w-full bg-black text-white flex flex-col items-center justify-center relative z-50 border-t border-white/10 pt-20 pb-10">
        <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-center opacity-30 hover:opacity-100 transition-opacity cursor-default">
          LET'S BUILD
        </h2>
        <p className="text-gray-400 mb-10 font-mono">npriyanshu63@gmail.com</p>
        <a href="mailto:npriyanshu63@gmail.com" className="group relative px-10 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform hover:scale-110 mb-20">
          <span className="relative z-10 group-hover:text-white transition-colors">Start a Project</span>
          <div className="absolute inset-0 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left ease-out duration-300"></div>
        </a>

        <div className="container mx-auto px-6 border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
            <a href="https://linkedin.com/in/npriyanshu" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com/npriyanshu" target="_blank" className="hover:text-white transition-colors">Twitter (X)</a>
            <a href="https://github.com/npriyanshu" target="_blank" className="hover:text-white transition-colors">GitHub</a>
          </div>

          <p className="text-xs text-gray-600 font-mono">
            © {new Date().getFullYear()} Priyanshu Negi. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default App