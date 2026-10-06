"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { hasFinePointer, isLowPowerDevice, prefersReducedMotion } from "@/lib/motion";

const NOISE = /* glsl */ `
// Ashima / Stefan Gustavson 3D simplex noise
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uIntro;
uniform vec2 uMouse;
uniform float uHover;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;
${NOISE}
float disp(vec3 p){
  vec3 m = normalize(vec3(uMouse * 1.4, 1.0));
  float pull = pow(max(dot(normalize(p), m), 0.0), 3.0) * (0.12 + uHover * 0.18);
  float n = snoise(p * 0.85 + vec3(0.0, uTime * 0.18, uTime * 0.06)) * 0.22;
  n += snoise(p * 1.7 - vec3(uTime * 0.21)) * 0.045;
  return (n + pull) * uIntro;
}
vec3 displaced(vec3 p){ return p + normalize(p) * disp(p); }
void main(){
  vec3 p = position;
  vec3 n = normalize(p);
  vec3 t = normalize(abs(n.y) > 0.99 ? cross(n, vec3(1.0,0.0,0.0)) : cross(n, vec3(0.0,1.0,0.0)));
  vec3 b = normalize(cross(n, t));
  float e = 0.012;
  vec3 dp = displaced(p);
  vec3 dt = displaced(normalize(p + t * e) * length(p));
  vec3 db = displaced(normalize(p + b * e) * length(p));
  vec3 nn = normalize(cross(dt - dp, db - dp));
  if (dot(nn, n) < 0.0) nn = -nn;
  vDisp = disp(p);
  vNormal = normalize(normalMatrix * nn);
  vec4 mv = modelViewMatrix * vec4(dp * (0.6 + 0.4 * uIntro), 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vDisp;

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

// Procedural studio environment — dark room, ivory softboxes, cobalt key.
vec3 env(vec3 r){
  r.xz = rot(uTime * 0.12 + uMouse.x * 0.6) * r.xz;
  r.yz = rot(uMouse.y * 0.35) * r.yz;
  float y = r.y;
  vec3 ivory = vec3(0.93,0.90,0.85);
  vec3 col = mix(vec3(0.010,0.010,0.014), vec3(0.05,0.05,0.062), smoothstep(-0.9, 0.6, y));
  // broad overhead softbox
  col += ivory * smoothstep(0.38, 0.85, y) * 0.95;
  // tall side strip light
  float sx = exp(-pow((r.x - 0.62) / 0.13, 2.0)) * smoothstep(-0.35, 0.35, y);
  col += ivory * sx * 0.75;
  // cobalt key from the left
  col += vec3(0.24,0.30,1.0) * pow(max(0.0, -r.x), 2.2) * 0.85;
  // violet floor bounce
  col += vec3(0.48,0.36,1.0) * pow(max(0.0, -y), 2.5) * 0.35;
  // soft horizon
  col += ivory * exp(-pow((y + 0.08) / 0.04, 2.0)) * 0.18;
  return col;
}

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  vec3 R = reflect(-V, N);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 col = env(R);
  // thin-film iridescence on the rim, very restrained
  vec3 film = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 1.2 + vDisp * 2.0));
  col = mix(col, col * film * 1.4, fres * 0.35);
  col += vec3(0.24,0.30,1.0) * fres * 0.55;
  // filmic tonemap + slight gamma
  col = col / (col + vec3(0.85));
  col = pow(col, vec3(0.9));
  gl_FragColor = vec4(col * 1.25, 1.0);
}
`;

type Props = { active: boolean; className?: string };

/** Liquid-chrome blob — a single shader mesh, lazy-loaded, paused offscreen. */
export default function HeroObject({ active, className }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const intro = useRef<{ value: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      const low = isLowPowerDevice();
      const reduce = prefersReducedMotion();

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !low, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.75));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
      camera.position.set(0, 0, 6);

      const uniforms = {
        uTime: { value: 0 },
        uIntro: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
      };
      intro.current = uniforms.uIntro;
      const geo = new THREE.IcosahedronGeometry(1.05, low ? 28 : 56);
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const resize = () => {
        const { width, height } = el.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      if (hasFinePointer()) window.addEventListener("pointermove", onMove, { passive: true });

      let visible = true;
      let raf = 0;
      const timer = new THREE.Timer();
      let t = 0;
      const loop = () => {
        raf = 0;
        if (!visible || document.hidden) return;
        timer.update();
        const dt = Math.min(timer.getDelta(), 0.05);
        t += dt * (reduce ? 0.15 : 1);
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        uniforms.uTime.value = t;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        mesh.rotation.y = t * 0.08 + mouse.x * 0.35;
        mesh.rotation.x = -mouse.y * 0.25;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (!raf) {
          timer.update();
          raf = requestAnimationFrame(loop);
        }
      };

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      });
      io.observe(el);
      const onVis = () => !document.hidden && start();
      document.addEventListener("visibilitychange", onVis);
      start();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        intro.current = null;
      };
      if (disposed) cleanup();
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  // Grow the object in when the hero becomes active
  useEffect(() => {
    if (!active) return;
    let tween: gsap.core.Tween | null = null;
    const id = window.setInterval(() => {
      if (!intro.current) return;
      window.clearInterval(id);
      tween = gsap.to(intro.current, { value: 1, duration: 2.6, ease: "expo.out", delay: 0.2 });
    }, 50);
    return () => {
      window.clearInterval(id);
      tween?.kill();
    };
  }, [active]);

  return (
    <div ref={host} className={className} aria-hidden="true">
      {failed && (
        <div
          className="absolute inset-[18%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #ece7dd 0%, #6d6f86 18%, #15161d 45%, #3d4dff 80%, #08080a 100%)",
          }}
        />
      )}
    </div>
  );
}
