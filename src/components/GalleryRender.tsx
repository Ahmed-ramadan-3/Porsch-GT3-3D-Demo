/*
Design commitment for this file:
Movement: Neo-Luxury Product Theatre gallery.
Purpose: render the same uploaded Porsche GT3 GLB as realistic gallery shots with consistent lighting and varied cinematic backgrounds.
Principles: same model identity, premium reflections, stable light rig, touch-responsive rotation, performance-conscious lazy rendering.
*/
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import modelUrl from "@/assets/models/porsche_gt3_rs.glb?url";

type GalleryShot = {
  title: string;
  subtitle: string;
  bg: "studio" | "tunnel" | "track" | "glass";
  rotation: [number, number, number];
  camera: [number, number, number];
};

export const galleryShots: GalleryShot[] = [
  { title: "لقطة الاستوديو البيضاء", subtitle: "انعكاس فاخر على أرضية بورسلين مضيئة", bg: "studio", rotation: [0.03, -0.72, 0], camera: [0, 1.08, 6.4] },
  { title: "ممر النيون الأحمر", subtitle: "إضاءة جانبية تكشف خطوط الجناح والرفارف", bg: "tunnel", rotation: [0.04, 0.82, 0], camera: [0.25, 1.12, 6.2] },
  { title: "منصة الحلبة المستقبلية", subtitle: "خلفية داكنة مع وهج أزرق وظل واقعي أسفل السيارة", bg: "track", rotation: [0.02, -1.35, 0], camera: [-0.2, 1.0, 6.55] },
  { title: "صالة الزجاج الديناميكية", subtitle: "بيئة زجاجية ناعمة تحافظ على نفس هوية الإضاءة", bg: "glass", rotation: [0.02, 0.1, 0], camera: [0, 1.16, 6.0] },
];

const bgPalettes = {
  studio: { a: 0xffffff, b: 0xe8eef7, c: 0xff1749, d: 0x55e6ff },
  tunnel: { a: 0x170b12, b: 0x2a111b, c: 0xff1749, d: 0xff8aa0 },
  track: { a: 0x07111f, b: 0x0f233b, c: 0x55e6ff, d: 0xff1749 },
  glass: { a: 0xf8fbff, b: 0xdde8f4, c: 0x78e6ff, d: 0xff1749 },
};

function createBackground(scene: THREE.Scene, shot: GalleryShot) {
  const palette = bgPalettes[shot.bg];
  scene.background = new THREE.Color(palette.a);
  scene.fog = new THREE.FogExp2(palette.b, shot.bg === "tunnel" ? 0.06 : 0.035);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5.2, 96),
    new THREE.MeshStandardMaterial({ color: palette.a, roughness: 0.18, metalness: 0.14, transparent: true, opacity: 0.86 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.08;
  floor.receiveShadow = true;
  scene.add(floor);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.15, 0.018, 10, 180),
    new THREE.MeshBasicMaterial({ color: palette.c, transparent: true, opacity: 0.78 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.02;
  scene.add(ring);

  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.018, 5.6),
      new THREE.MeshBasicMaterial({ color: i % 2 ? palette.c : palette.d, transparent: true, opacity: 0.34 })
    );
    line.position.set((i - 2) * 0.95, -0.95, -1.4 - i * 0.12);
    line.rotation.y = shot.bg === "tunnel" ? 0.25 : -0.18;
    scene.add(line);
  }

  if (shot.bg === "glass") {
    for (let i = 0; i < 3; i++) {
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 2.6),
        new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.25, opacity: 0.2, transparent: true, roughness: 0.06, metalness: 0.05 })
      );
      panel.position.set(-2.2 + i * 2.1, 0.2, -2.5);
      panel.rotation.y = -0.22 + i * 0.12;
      scene.add(panel);
    }
  }
}

export default function GalleryRender({ shot, index }: { shot: GalleryShot; index: number }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(...shot.camera);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);

    createBackground(scene, shot);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xb9c4d9, 2.6);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 5.4);
    key.position.set(4, 4.8, 5.6);
    key.castShadow = true;
    scene.add(key);
    const red = new THREE.PointLight(0xff1749, 9.5, 10);
    red.position.set(-3.6, 1.15, 2.8);
    scene.add(red);
    const cyan = new THREE.PointLight(0x55e6ff, 7.8, 10);
    cyan.position.set(3.4, 1.7, -1.8);
    scene.add(cyan);

    const root = new THREE.Group();
    scene.add(root);
    let car: THREE.Object3D | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    const loader = new GLTFLoader();
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
            mat.envMapIntensity = 1.25;
            mat.needsUpdate = true;
          }
        }
      });
      const box = new THREE.Box3().setFromObject(car);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      car.position.sub(center);
      car.scale.setScalar(3.0 / size);
      car.rotation.set(...shot.rotation);
      car.position.y = -0.5;
      root.add(car);
    });

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onMove);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      if (car) {
        root.rotation.y += (pointerX * 0.08 - root.rotation.y) * 0.045;
        root.rotation.x += (-pointerY * 0.045 - root.rotation.x) * 0.045;
        car.rotation.y += 0.0015 + index * 0.00025;
      }
      red.intensity = 8.5 + Math.sin(t * 2 + index) * 1.2;
      cyan.intensity = 7 + Math.cos(t * 1.7 + index) * 1.0;
      camera.lookAt(0, -0.08, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", onMove);
      draco.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [shot, index]);

  return <div className={`gallery-render gallery-render--${shot.bg}`} ref={mountRef} aria-label={shot.title} />;
}
