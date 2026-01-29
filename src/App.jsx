import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger)

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
const TechLogo = ({ name, url, invert = false, className = "w-[clamp(1.5rem,2.5vw,2.5rem)] h-[clamp(1.5rem,2.5vw,2.5rem)]" }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className={`p-[1vw] bg-white/5 border border-white/10 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] group-hover:scale-125 group-hover:-translate-y-2 ${invert ? "invert" : ""}`}>
      <img src={url} alt={name} className={`${className} object-contain opacity-80 group-hover:opacity-100 transition-opacity`} />
    </div>
    <span className="text-[clamp(0.6rem,1vw,0.8rem)] text-gray-500 font-mono opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
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
  // Removed duplicate orbsRef declaration
  const workContainerRef = useRef(null) // NEW: Ref for the horizontal container

  const [commitCount, setCommitCount] = useState(450); // Default fallback

  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/npriyanshu')
      .then(response => response.json())
      .then(data => {
        // data.total[2024] or similar depending on API response structure. 
        // The API returns { total: { "2024": 123, ... }, ... }
        // We want the current year's commits or simply the total for the last year queried.
        const total = Object.values(data?.total || {}).reduce((acc, count) => acc + count, 0);
        // If it's early in the year, maybe show last year's too? 
        // Let's stick to current year as per label "COMMITS (2025)" or just generic.
        // Actually the label says (2024). Let's maximize it.
        // If 2025 count is low, maybe sum them up? 
        // For now, let's just grab the one that matches the label or update the label.

        // Let's look at all totals and pick the max or current.
        // Better yet, let's just display the total for the current year.
        if (total > 0) {
          setCommitCount(total);
          // Animate the counter
          gsap.fromTo(".stat-number",
            { textContent: 0 },
            {
              textContent: total,
              duration: 2.5,
              ease: "power2.out",
              snap: { textContent: 1 },
              delay: 0.5
            }
          );
        }
      })
      .catch(err => console.error("Failed to fetch Github stats:", err));
  }, []);

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
    const introTl = gsap.timeline();

    // Ensure elements exist before animating
    // 1. Reveal Title Characters
    introTl.from(".name-char", {
      yPercent: 100,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.05,
      delay: 0.2
    })
      // 2. Reveal Image
      .to(".pose-front", {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power4.out"
      }, "<0.2")
      // 3. Reveal Status Badge
      .fromTo(".status-badge",
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=1"
      )
      // 4. Expand Lines and Reveal Tagline
      .to(".hero-line", {
        scaleX: 1,
        duration: 1,
        ease: "expo.out"
      }, "-=0.6")
      .to(".hero-tagline", {
        autoAlpha: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8");

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
          invalidateOnRefresh: true
        },
        defaults: { ease: "power2.inOut" }
      });

      // Set initial states at timeline start (will be respected on reload)
      tl.set(".pose-front", { opacity: 1 }, 0)
        .set([".pose-right", ".pose-left"], { opacity: 0 }, 0)
        .set([".pose-upsidedown", ".pose-close"], { opacity: 0 }, 0)
        .set(".pose-close", { scale: 0.8 }, 0) // Start slightly zoomed out
        .set(".pose-upsidedown", { y: "0%" }, 0)

      // --- Phase 1: Hero -> Dashboard ---
      tl.to(maskRef.current, {
        width: isMobile ? "90vw" : "35vw",
        height: isMobile ? "90vw" : "35vw",
        borderRadius: "50%",
        scale: 0.5,
        y: isMobile ? "-30vh" : 100,
        border: "1px solid rgba(255,255,255,0.2)",
        ease: "power3.inOut"
      }, "phase1")
        .to(bgRef.current, { backgroundColor: "#172554" }, "phase1")
        // Robust Crossfade: Right fades IN, Front fades OUT slightly later

        .to(".hero-title", { opacity: 0, y: -100 }, "phase1")
        .set(".pose-front", { opacity: 0 }, "phase1")

      // --- Phase 2: Enter Dashboard ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "-25vw",
        y: isMobile ? "-35vh" : 0,
        rotation: -10,
      }, "phase2")
        .to(".pose-right", { opacity: 1 }, "phase2")
        .to(".pose-front", { opacity: 0 }, "phase2")
        .to(".dashboard-ui", {
          autoAlpha: 1,
          y: 0,
          duration: 1,
        }, "phase2")

      // Removed conflicting stat-number animation to allow React state to show


      // --- Phase 3: Dashboard Exit -> About Enter ---
      tl.to(maskRef.current, {
        x: isMobile ? 0 : "25vw",
        y: isMobile ? "-35vh" : 0,
        rotation: 10,
        scale: 0.7, // Made bigger
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
        // Pose Change: Right -> Left
        .to(".pose-left", { opacity: 1 }, "phase3")
        .to(".pose-right", { opacity: 0 }, "phase3")

      // --- Phase 4: About Exit -> Process Enter ---
      tl.to(".about-ui", { autoAlpha: 0, y: -50 }, "phase4")
        .to(maskRef.current, { scale: 0.4, x: 0, y: -50, rotation: 0, borderRadius: "20%" }, "phase4")
        .to(bgRef.current, { backgroundColor: "#111" }, "phase4")
        // Pose Change: Left -> UpsideDown (Spider-Man entrance)
        .set(".pose-upsidedown", { y: "-100%", opacity: 1 }, "phase4")
        .to(".pose-upsidedown", { y: "0%", duration: 1.5, ease: "power2.out" }, "phase4")
        .to(".pose-left", { opacity: 0 }, "phase4")
        .to(".process-ui", { autoAlpha: 1 }, "phase4+=0.5")
        .from(".process-step", {
          opacity: 0,
          y: 20,
          stagger: 0.5
        }, "phase4+=1")

      // --- Phase 5: Process Exit -> Testimonials Enter ---
      tl.to(".process-ui", { autoAlpha: 0, scale: 0.9 }, "phase5")
        .to(maskRef.current, {
          scale: 2,
          rotation: 0,
          borderRadius: "0%",
          width: "100%",
          height: "100%",
        }, "phase5")
        // Pose Change: UpsideDown -> Close (Zoom In Effect)
        .to(".pose-close", { opacity: 0.4, scale: 1.1, duration: 1.5 }, "phase5")
        .to(".pose-upsidedown", { opacity: 0 }, "phase5")
        .to(bgRef.current, { backgroundColor: "#050505" }, "phase5")
        .to(".testimonials-ui", { autoAlpha: 1, x: 0 }, "phase5+=0.5")
        .fromTo(".testimonial-card",
          { x: "100vw", opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.15, duration: 1.5, ease: "power2.out" },
          "phase5+=0.8"
        )

      // --- Phase 6: Testimonials Exit -> Work Enter ---
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
              <img ref={imageRef} src="/me-front.png" alt="Priyanshu Front" className="pose-img pose-front absolute inset-0 w-full h-full object-contain object-top origin-center scale-125 z-10" />
              <img src="/me-right.png" alt="Priyanshu Right" className="pose-img pose-right absolute inset-0 w-full h-full object-contain object-top origin-center scale-125 opacity-0 z-20 grayscale" />
              <img src="/me-left.png" alt="Priyanshu Left" className="pose-img pose-left absolute inset-0 w-full h-full object-contain object-top origin-center scale-100 opacity-0 z-20 grayscale" />
            </div>

            {/* Spider-Man entrance - outside mask - centered */}
            <div className="pose-upsidedown fixed inset-0 flex items-center justify-center opacity-0 z-30 pointer-events-none">
              <img src="/me-upsidedown.png" alt="Priyanshu Upside Down" className="pose-img w-auto h-screen object-contain grayscale" />
            </div>

            {/* Me Close - outside mask - centered */}
            <div className="pose-close fixed inset-0 flex items-center justify-center opacity-0 z-20 pointer-events-none">
              <img src="/me-close.png" alt="Priyanshu Close" className="pose-img w-full md:w-[80vw] h-auto object-cover md:object-contain grayscale origin-center" />
            </div>
          </div>

          {/* Layer 2: HERO UI */}
          {/* Layer 2: HERO UI */}
          <div className="hero-title absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none p-4 mix-blend-screen will-change-transform">
            {/* Status Dot */}
            <div className="absolute top-24 md:top-10 right-10 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto opacity-0 -translate-y-4 status-badge">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-green-300 uppercase tracking-wider">Available for Freelance</span>
            </div>

            <h1 className="text-[13vw] md:text-[11vw] font-black uppercase leading-[0.8] text-center tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-gray-600 drop-shadow-lg overflow-hidden">
              <span className="inline-block overflow-hidden text-white">
                {"Priyanshu".split("").map((char, i) => (
                  <span key={i} className="name-char inline-block">{char}</span>
                ))}
              </span>
              <br />
              <span className="font-editorial font-thin text-white inline-block overflow-hidden">
                {"Negi".split("").map((char, i) => (
                  <span key={i} className="name-char inline-block">{char}</span>
                ))}
              </span>
            </h1>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px w-8 md:w-16 bg-linear-to-r from-transparent to-white hero-line scale-x-0 origin-right"></div>
              <p className="text-xs md:text-xl font-mono tracking-[0.2em] text-blue-200 uppercase glow-text hero-tagline opacity-0">Crafting pixel-perfect digital experiences</p>
              <div className="h-px w-8 md:w-16 bg-linear-to-l from-transparent to-white hero-line scale-x-0 origin-left"></div>
            </div>

            {/* Location Badge */}
            <div className="mt-6 flex items-center gap-2 opacity-60">
              <span className="text-sm font-mono text-gray-300">Based in India 🇮🇳</span>
            </div>
          </div>

          {/* DASHBOARD UI */}
          {/* DASHBOARD UI */}
          {/* DASHBOARD UI */}
          <div className="dashboard-ui opacity-0 invisible translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-[5vh] items-center md:items-end md:justify-center md:pr-[5vw] lg:pr-[8vw]">
            <div className="h-screen w-[90%] md:w-auto md:max-w-[45vw] text-center md:text-right">
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-black mb-[2vh] uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Dev Arsenal
              </h2>
              <div className="grid grid-cols-2 gap-[1.5vw] text-left">
                <div className="bg-white/5 backdrop-blur-md p-[2vw] rounded-2xl border border-white/10 shadow-lg group hover:bg-white/10 transition-colors">
                  <h3 className="text-blue-300 font-bold text-[clamp(0.7rem,1vw,0.9rem)] tracking-widest mb-[1.5vh]">CURRENTLY LEARNING</h3>
                  <div className="flex flex-wrap gap-[1vw] items-center">
                    <TechLogo name="Kafka" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" invert />
                    <div>
                      <p className="text-[clamp(0.8rem,1.2vw,1rem)] font-bold text-white leading-tight">Kafka & <br /> Scalable Systems</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-[2vw] rounded-2xl border border-white/10 shadow-lg group hover:bg-white/10 transition-colors">
                  <h3 className="text-purple-300 font-bold text-[clamp(0.7rem,1vw,0.9rem)] tracking-widest mb-[1vh]">GITHUB STATS</h3>
                  <div className="flex items-baseline gap-[0.5vw]">
                    <span className="text-[clamp(2rem,3vw,3rem)] font-mono text-white stat-number">{commitCount}</span>
                    <span className="text-[clamp(2rem,3vw,3rem)] font-mono text-white">+</span>
                    <span className="text-[clamp(0.6rem,0.8vw,0.8rem)] text-gray-400">LIFETIME COMMITS</span>
                  </div>
                </div>
                <div className="col-span-2 bg-linear-to-r from-white/10 to-transparent backdrop-blur-md p-[2vw] rounded-2xl border border-white/10">
                  <h3 className="text-gray-400 font-bold text-[clamp(0.7rem,1vw,0.9rem)] tracking-widest mb-[2vh]">ENGINEERING ARSENAL</h3>
                  <div className="flex gap-[2vw] flex-wrap justify-center md:grid md:grid-cols-7 md:gap-[1vw] md:justify-items-center">
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
                    <TechLogo name="AWS" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" className="w-[clamp(2rem,3vw,3rem)] h-[clamp(2rem,3vw,3rem)]" invert />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT UI */}
          <div className="h-screen about-ui opacity-0 invisible translate-y-20 absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-[5vh] items-center md:items-start md:justify-center md:pl-[5vw] lg:pl-[8vw]">
            <div className="w-[90%] md:w-auto md:max-w-[50vw] text-center md:text-left bg-black/40 md:bg-transparent p-[3vw] rounded-2xl backdrop-blur-xl border border-white/5 md:border-none">
              <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black mb-[2vh] leading-none">
                SIMPLIFYING <br /> <span className="text-indigo-400 font-editorial">Complexity</span>
              </h2>
              <div className="pl-[2vw] border-l-2 border-indigo-500 mb-[4vh]">
                <p className="text-gray-300 text-[clamp(0.9rem,1.2vw,1.1rem)] leading-relaxed mb-4">
                  "I focus on user experiences and efficient back-end solutions, thrive in collaboration, and explore new technologies for impactful results."
                </p>
                <h4 className="text-[clamp(0.7rem,1vw,0.9rem)] text-gray-500 font-mono uppercase tracking-widest mb-3">Toolkit</h4>
                <div className="flex gap-[1vw] mb-6">
                  <TechLogo name="VS Code" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" />
                  <TechLogo name="AWS" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" className="w-[clamp(2.5rem,4vw,4rem)] h-[clamp(2.5rem,4vw,4rem)]" invert />
                  <TechLogo name="Postman" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" />
                  <TechLogo name="Docker" url="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" />
                </div>
                <h4 className="text-[clamp(0.7rem,1vw,0.9rem)] text-gray-500 font-mono uppercase tracking-widest mb-3">Personal Hobbies</h4>
                <div className="flex gap-[1vw]">
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
            <h2 className="text-[clamp(2.5rem,5vw,6rem)] font-black text-white mb-[4vh] tracking-tighter text-center">THE PROCESS</h2>
            <div className="flex flex-col gap-[2vh] w-[90%] max-w-[80vw] pointer-events-auto">
              {[
                { id: "01", title: "Discovery", desc: "Understanding the core problem and user needs." },
                { id: "02", title: "Architecture", desc: "Designing scalable and robust systems." },
                { id: "03", title: "Build", desc: "Crafting clean, maintained, and efficient code." },
                { id: "04", title: "Deploy", desc: "Shipping with CI/CD and automated monitoring." }
              ].map((step, i) => (
                <div key={step.id} className="process-step flex items-start md:items-center gap-[2vw] p-[2vw] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                  <span className="text-[clamp(1.5rem,3vw,3rem)] font-mono text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500 font-bold">{step.id}</span>
                  <div>
                    <h3 className="text-[clamp(1rem,1.5vw,2rem)] font-bold text-white">{step.title}</h3>
                    <p className="text-[clamp(0.8rem,1vw,1rem)] text-gray-400 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WHAT I BRING UI */}
          <div className="testimonials-ui opacity-0 invisible absolute inset-0 z-40 pointer-events-none flex flex-col justify-center items-center px-6">
            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white mb-3 text-center tracking-tighter">
              WHAT I <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-500 font-editorial italic">Bring</span>
            </h2>
            <p className="text-gray-400 text-center mb-12 font-mono text-sm max-w-2xl">Value-driven development with a focus on quality and impact</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl pointer-events-auto">
              {[
                {
                  icon: "⚡",
                  title: "Performance First",
                  desc: "Optimized code that scales. Every millisecond counts.",
                  color: "from-yellow-500 to-orange-500"
                },
                {
                  icon: "🎯",
                  title: "Pixel Perfect",
                  desc: "Designs brought to life with meticulous attention to detail.",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: "🚀",
                  title: "Ship Fast",
                  desc: "Rapid iteration without compromising quality or stability.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: "🔧",
                  title: "Clean Architecture",
                  desc: "Maintainable, scalable systems built for the long term.",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  icon: "💡",
                  title: "Problem Solver",
                  desc: "Creative solutions to complex technical challenges.",
                  color: "from-indigo-500 to-purple-500"
                },
                {
                  icon: "🤝",
                  title: "Team Player",
                  desc: "Collaborative approach with clear communication.",
                  color: "from-pink-500 to-red-500"
                }
              ].map((item, i) => (
                <div key={i} className="testimonial-card group p-6 bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-300 hover:-translate-y-2" style={{ opacity: 1 }}>
                  <div className={`text-5xl mb-4 transition-transform duration-300 group-hover:scale-110`}>{item.icon}</div>
                  <h3 className={`text-xl font-bold mb-2 bg-linear-to-r ${item.color} bg-clip-text text-transparent`}>{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SELECTED WORKS (HORIZONTAL SCROLL) */}
          <div className="work-ui opacity-0 invisible absolute inset-0 z-40 pointer-events-none flex flex-col justify-center h-full overflow-hidden">

            <div className="container mx-auto px-6 mb-[4vh]">
              <h2 className="work-title text-[clamp(2.5rem,6vw,5rem)] text-white uppercase font-black tracking-tighter">
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
                    className={`w-full h-full rounded-3xl border border-white/10 shadow-[0_-5px_30px_rgba(0,0,0,0.8)] p-[3vw] flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/20 ${project.bg}`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${project.color}`}></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-full">
                        <span className="inline-block px-3 py-1 mb-[2vh] text-[clamp(0.6rem,0.9vw,0.8rem)] font-mono font-bold tracking-widest bg-white/10 rounded-full text-white/80">{project.role}</span>
                        <h3 className="text-[clamp(1.8rem,4vw,4rem)] font-black text-white mb-[1vh] leading-none break-all w-full">{project.title}</h3>
                        <p className="text-gray-400 font-medium text-[clamp(0.8rem,1.2vw,1.1rem)] leading-tight">{project.subtitle}</p>
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
            {/* <a href="https://linkedin.com/in/npriyanshu" target="_blank" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://twitter.com/npriyanshu" target="_blank" className="hover:text-white transition-colors">Twitter (X)</a> */}
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