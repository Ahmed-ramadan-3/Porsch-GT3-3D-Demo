/*
Design commitment for this file:
Movement: Neo-Luxury Product Theatre inspired by Apple launch pages and Porsche motorsport precision.
Principles: asymmetric cinematic staging, porcelain-light luxury surfaces, black-glass technical panels, Porsche red neon energy.
Interactions: scroll drives the fixed GT3 model horizontally/vertically while text appears like premium keynote slides.
*/
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, Gauge, Zap, Cpu, Wind, Volume2, Camera, Phone } from "lucide-react";
import modelUrl from "@/assets/models/porsche_gt3_rs.glb?url";
import gt3Rear from "@/assets/gallery/gt3-rear-mountain.jpeg";
import gt3Autumn from "@/assets/gallery/gt3-autumn.jpeg";
import gt3Green from "@/assets/gallery/gt3-green.jpeg";
import gt3Interior from "@/assets/gallery/gt3-interior.jpeg";

interface HomeProps {
  targetSection?: string;
}

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["home", "الصفحة الرئيسية"],
  ["specs", "مواصفات السيارة"],
  ["performance", "الأداء والمحرك"],
  ["interior", "التصميم الداخلي"],
  ["technology", "التكنولوجيا"],
  ["gallery", "معرض الصور"],
  ["compare", "مقارنة الأداء"],
  ["pricing", "السعر والفئات"],
  ["contact", "تواصل معنا"],
];

const stats = [
  { label: "القوة", value: "510", unit: "PS / 375 kW" },
  { label: "العزم", value: "450", unit: "نيوتن متر" },
  { label: "السرعة القصوى", value: "311", unit: "كم/س" },
  { label: "المحرك", value: "4.0", unit: "لتر Flat‑Six" },
];

const presentationSlides = [
  {
    eyebrow: "هندسة حلبة يومية",
    title: "911 GT3 ليست سيارة فقط، إنها آلة تركيز.",
    body: "محرك 4.0 لتر بست أسطوانات متقابلة طبيعي التنفس، بقوة 510 PS وعزم 450 نيوتن متر، مع استجابة مباشرة وناقل PDK من 7 سرعات أو ناقل يدوي حسب الفئة.",
    icon: Gauge,
  },
  {
    eyebrow: "صوت ميكانيكي نقي",
    title: "كل ضغطة دواسة تتحول إلى سيمفونية معدنية.",
    body: "المحرك يصل إلى 9,000 دورة/دقيقة، لذلك يأتي صوت العادم حاداً ونقياً ومتصلاً مباشرة بطبيعة محرك Flat‑Six عالي الدوران.",
    icon: Volume2,
  },
  {
    eyebrow: "ديناميكية هوائية",
    title: "الهواء هنا جزء من نظام القيادة.",
    body: "الجناح الخلفي بتثبيت علوي وفتحات التهوية الأمامية والخلفية تساعد على الثبات الهوائي وتقليل الرفع عند السرعات العالية.",
    icon: Wind,
  },
];

const featureCards = [
  { title: "نظام تعليق مخصص للحلبات", text: "ضبط دقيق يمنح توازناً بين الصلابة والاتصال المباشر بالطريق.", icon: Zap },
  { title: "مكابح عالية الأداء", text: "استجابة قوية وثبات متكرر تحت الضغط، مع خيارات كربون سيراميك.", icon: Gauge },
  { title: "أوضاع قيادة متعددة", text: "إعدادات Track وSport لتغيير شخصية السيارة فوراً.", icon: Cpu },
  { title: "ظلال وانعكاسات واقعية", text: "الموديل ثلاثي الأبعاد ثابت على الشاشة ويتحرك سينمائياً مع التمرير.", icon: Camera },
];

function useThreeScene(canvasRef: React.RefObject<HTMLCanvasElement | null>, setProgress: (n: number) => void) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf7f9ff, 0.035);

    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.15, 7.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const root = new THREE.Group();
    scene.add(root);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xb9c4d9, 2.7);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 5.8);
    key.position.set(4, 5, 6);
    key.castShadow = true;
    scene.add(key);
    const red = new THREE.PointLight(0xff183d, 12, 11);
    red.position.set(-4, 1.2, 3);
    scene.add(red);
    const cyan = new THREE.PointLight(0x55e6ff, 9, 10);
    cyan.position.set(4, 2, -2);
    scene.add(cyan);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 96),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0.08, transparent: true, opacity: 0.38 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.05;
    floor.receiveShadow = true;
    root.add(floor);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.95, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0xff123c, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.96;
    root.add(ring);

    const particleGeo = new THREE.BufferGeometry();
    const count = 520;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xdde9ff, size: 0.022, transparent: true, opacity: 0.7 })
    );
    scene.add(particles);

    let car: THREE.Object3D | null = null;
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_, loaded, total) => setProgress(Math.round((loaded / total) * 100));
    manager.onLoad = () => setProgress(100);

    const draco = new DRACOLoader(manager);
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    const loader = new GLTFLoader(manager);
    loader.setDRACOLoader(draco);
    loader.load(modelUrl, (gltf) => {
      car = gltf.scene;
      car.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.envMapIntensity = 1.35;
            mat.needsUpdate = true;
          }
        }
      });
      const box = new THREE.Box3().setFromObject(car);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      car.position.sub(center);
      car.scale.setScalar(3.15 / size);
      car.rotation.set(0.02, -0.7, 0);
      car.position.y = -0.52;
      root.add(car);
      gsap.fromTo(root.scale, { x: 0.72, y: 0.72, z: 0.72 }, { x: 1, y: 1, z: 1, duration: 1.6, ease: "expo.out" });
    });

    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".site-shell",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.25,
      },
    });
    tl.to(root.position, { x: -1.75, y: 0.24, z: 0, ease: "none" }, 0)
      .to(root.rotation, { y: 1.1, x: 0.02, z: 0, ease: "none" }, 0)
      .to(camera.position, { x: 1.0, y: 1.55, z: 6.25, ease: "none" }, 0.15)
      .to(root.position, { x: 1.8, y: -0.18, z: 0, ease: "none" }, 0.34)
      .to(root.rotation, { y: -1.2, x: 0.02, z: 0, ease: "none" }, 0.34)
      .to(camera.position, { x: -0.9, y: 1.05, z: 7.2, ease: "none" }, 0.5)
      .to(root.position, { x: -1.1, y: 0.36, z: 0, ease: "none" }, 0.66)
      .to(root.rotation, { y: 1.35, x: 0.02, z: 0, ease: "none" }, 0.66)
      .to(root.position, { x: 0.65, y: -0.1, z: 0, ease: "none" }, 0.84)
      .to(root.rotation, { y: -0.35, x: 0.02, z: 0, ease: "none" }, 0.84);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.025;
      ring.rotation.z = t * 0.18;
      red.intensity = 10 + Math.sin(t * 2.4) * 2;
      cyan.position.x = 3.6 + Math.sin(t * 0.8) * 0.7;
      if (car) {
        car.rotation.y += 0.0022;
        car.rotation.y += mouse.x * 0.0008;
      }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      ScrollTrigger.getAll().forEach((s) => s.kill());
      draco.dispose();
      renderer.dispose();
      particleGeo.dispose();
    };
  }, [canvasRef, setProgress]);
}

export default function Home({ targetSection }: HomeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useThreeScene(canvasRef, setProgress);

  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setLoaded(true), 650);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (targetSection) document.getElementById(targetSection)?.scrollIntoView({ behavior: "smooth" });
  }, [targetSection]);

  useEffect(() => {
    if (reduced) return;
    gsap.fromTo(".reveal", { y: 90, opacity: 0, filter: "blur(16px)" }, {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.1,
      stagger: 0.08,
      ease: "power4.out",
      scrollTrigger: { trigger: ".site-shell", start: "top 80%" },
    });

    gsap.utils.toArray<HTMLElement>(".story-panel").forEach((panel) => {
      gsap.fromTo(panel.querySelectorAll(".slide-reveal"), { y: 80, opacity: 0, scale: 0.96 }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: panel, start: "top 65%", end: "bottom 35%", toggleActions: "play reverse play reverse" },
      });
    });

    gsap.utils.toArray<HTMLElement>("section[id]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveSection(section.id),
        onEnterBack: () => setActiveSection(section.id),
      });
    });

    gsap.to(".parallax-orb", {
      yPercent: -35,
      xPercent: 18,
      ease: "none",
      scrollTrigger: { trigger: ".site-shell", start: "top top", end: "bottom bottom", scrub: true },
    });
  }, [reduced]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="site-shell" dir="rtl">
      <div className={`loader ${loaded ? "loader--done" : ""}`} aria-hidden={loaded}>
        <div className="loader__ring"><span>{Math.min(progress, 100)}%</span></div>
        <p>بورشه 911 GT3</p>
      </div>

      <canvas ref={canvasRef} className="gt3-canvas" aria-label="نموذج ثلاثي الأبعاد لبورشه 911 GT3" />
      <div className="ambient-grid" />
      <div className="parallax-orb orb-a" />
      <div className="parallax-orb orb-b" />

      <header className="nav-shell">
        <button className="brand" onClick={() => goTo("home")} aria-label="العودة للرئيسية">
          <span>911</span><b>GT3</b>
        </button>
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {navItems.slice(0, 7).map(([id, label]) => (
            <button key={id} className={activeSection === id ? "active" : ""} onClick={() => goTo(id)}>{label}</button>
          ))}
        </nav>
        <button className="nav-cta" onClick={() => goTo("contact")}>احجز تجربة</button>
        <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="فتح القائمة">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div className={`mobile-panel ${menuOpen ? "open" : ""}`}>
        {navItems.map(([id, label]) => <button key={id} onClick={() => goTo(id)}>{label}</button>)}
      </div>

      <section id="home" className="hero section-stage">
        <div className="hero-copy reveal">
          <span className="eyebrow"> Porsch GT3 </span>
          <h1>Porsch GT3  <br />دقة الحلبة على الطريق.</h1>
          <p> بمعلومات دقيقة، صور حقيقية،Porsch GT3.</p>
          <div className="hero-actions">
            <button onClick={() => goTo("performance")}>استكشف الأداء</button>
            <button className="ghost" onClick={() => goTo("gallery")}>شاهد المعرض</button>
          </div>
        </div>
        <div className="hero-spec-strip reveal">
          {stats.map((s) => <div key={s.label}><strong>{s.value}</strong><span>{s.unit}</span><small>{s.label}</small></div>)}
        </div>
      </section>

      <section id="specs" className="section-stage specs-grid">
        <div className="section-copy reveal">
          <span className="eyebrow">مواصفات السيارة</span>
          <h2>مواصفات أساسية من قلب عائلة 911 GT3.</h2>
          <p>تعتمد السيارة على محرك 4.0 لتر عالي الدوران طبيعي التنفس، بقوة 510 PS وعزم 450 نيوتن متر وسرعة قصوى 311 كم/س حسب بيانات بورشه الرسمية.</p>
        </div>
        <div className="cards-grid">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return <article className="glass-card reveal" key={card.title}><Icon /><h3>{card.title}</h3><p>{card.text}</p></article>;
          })}
        </div>
      </section>

      <section id="performance" className="section-stage performance-panel story-panel">
        <div className="slide-reveal">
          <span className="eyebrow">الأداء والمحرك</span>
          <h2>محرك 4.0 لتر سداسي الأسطوانات متقابل أفقياً، طبيعي التنفس، بقوة 510 PS عند 8,500 دورة/دقيقة وعزم 450 نيوتن متر عند 6,250 دورة/دقيقة.</h2>
        </div>
        <div className="power-bars slide-reveal">
          <div><span>510 PS / 375 kW</span><b style={{ width: "94%" }} /></div>
          <div><span>450 نيوتن متر</span><b style={{ width: "86%" }} /></div>
          <div><span>9,000 دورة/دقيقة</span><b style={{ width: "98%" }} /></div>
        </div>
      </section>

      <section id="interior" className="section-stage split-section story-panel">
        <div className="glass-plate slide-reveal"><h2>التصميم الداخلي</h2><p>المقصورة تركز على السائق: مقاعد رياضية خفيفة، عجلة قيادة GT Sport، شاشة مركزية، وخامات Race‑Tex/جلد حسب التجهيزات، مع إمكانية حزمة Clubsport في بعض الأسواق.</p></div>
        <div className="interior-lines slide-reveal"><span /> <span /> <span /></div>
      </section>

      <section id="technology" className="section-stage tech-mosaic">
        <div className="section-copy reveal"><span className="eyebrow">التكنولوجيا</span><h2>ذكاء ميكانيكي قبل أن يكون رقمياً.</h2><p>تدعم السيارة أنظمة Porsche Communication Management، تطبيقات Porsche Connect، إعدادات قيادة رياضية، ونظام تعليق PASM مضبوط لاستخدامات الطريق والحلبة.</p></div>
        <div className="tech-list reveal">
          <p>PDK من 7 سرعات أو ناقل يدوي</p><p>نظام PASM الرياضي</p><p>توجيه المحور الخلفي</p><p>حزمة Weissach اختيارية</p>
        </div>
      </section>

      <section id="gallery" className="section-stage gallery-section story-panel">
        <div className="gallery-copy slide-reveal"><span className="eyebrow">معرض الصور</span><h2>صور حقيقية للسيارة من زوايا مختلفة: خارجية، حلبة، خلفية، ومقصورة داخلية.</h2></div>
        <div className="gallery-grid realistic-gallery slide-reveal">
          {[
            { src: gt3Rear, title: "الجناح الخلفي والوقفة العريضة", text: "صورة حقيقية تبرز الجناح الخلفي والعجلات المركزية وخط الإضاءة الخلفي." },
            { src: gt3Autumn, title: "GT3 Touring بطابع يومي", text: "لقطة واقعية توضح الجانب الأكثر هدوءاً وأناقة من عائلة GT3." },
            { src: gt3Green, title: "هيكل GT3 بخطوط نظيفة", text: "زاوية خارجية تُظهر توازن التصميم بين الفخامة والطابع الرياضي." },
            { src: gt3Interior, title: "مقصورة موجهة للسائق", text: "قمرة قيادة بأدوات واضحة وخامات رياضية وتجهيزات تركّز على التحكم." },
          ].map((shot) => (
            <article className="gallery-card photo-card" key={shot.title}>
              <img src={shot.src} alt={shot.title} loading="lazy" />
              <div className="render-card__caption">
                <strong>{shot.title}</strong>
                <span>{shot.text}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="compare" className="section-stage compare-section">
        <div className="section-copy reveal"><span className="eyebrow">مقارنة الأداء</span><h2>GT3 ضد سيارات رياضية فاخرة.</h2></div>
        <div className="compare-table reveal">
          <div><b>الموديل</b><b>0-100</b><b>السرعة القصوى</b><b>القوة</b></div>
          <div><span>911 GT3</span><span>حسب الناقل والسوق</span><span>311 كم/س</span><span>510 PS</span></div>
          <div><span>911 Carrera S</span><span>أسرع في بعض نسخ PDK</span><span>نطاق 308 كم/س</span><span>تقريباً 450 PS</span></div>
          <div><span>718 Cayman GT4 RS</span><span>3.4 ث تقريباً</span><span>315 كم/س تقريباً</span><span>500 PS</span></div>
        </div>
      </section>

      <section id="pricing" className="section-stage pricing-section story-panel">
        <div className="price-card slide-reveal"><span className="eyebrow">السعر والفئات</span><h2>فئة GT3</h2><p>السعر يختلف حسب الدولة والضرائب والتجهيزات. الأفضل الاعتماد على وكيل بورشه المحلي أو صفحة Porsche Configurator للحصول على السعر النهائي.</p><strong>تخصيص حسب الطلب</strong></div>
        <div className="price-card accent slide-reveal"><h2>GT3 Touring</h2><p>تحافظ فئة Touring على نفس المحرك عالي الدوران مع مظهر خارجي أكثر هدوءاً بدون الجناح الخلفي الكبير.</p><strong>أناقة مخفية</strong></div>
      </section>

      <section className="presentation-stack">
        {presentationSlides.map((slide, idx) => {
          const Icon = slide.icon;
          return <section className="showcase-slide story-panel" key={slide.title}>
            <div className="slide-number slide-reveal">0{idx + 1}</div>
            <Icon className="slide-icon slide-reveal" />
            <span className="eyebrow slide-reveal">{slide.eyebrow}</span>
            <h2 className="slide-reveal">{slide.title}</h2>
            <p className="slide-reveal">{slide.body}</p>
          </section>;
        })}
      </section>

      <section id="contact" className="section-stage contact-section">
        <div className="contact-card reveal">
          <Phone />
          <span className="eyebrow">تواصل معنا</span>
          <h2>جاهز لتجربة GT3 بطريقة مختلفة؟</h2>
          <p>اترك بياناتك للحصول على تجربة عرض أو استشارة تخصيص عبر الوكيل المحلي.</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <input aria-label="الاسم" placeholder="الاسم الكامل" />
            <input aria-label="البريد الإلكتروني" placeholder="البريد الإلكتروني" type="email" />
            <button>إرسال الطلب</button>
          </form>
        </div>
      </section>

      <footer>موقع تصميم وليس حقيقي  Porsche 911 GT3.</footer>
    </main>
  );
}
