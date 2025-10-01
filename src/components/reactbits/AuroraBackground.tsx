import { Canvas, extend, useFrame, type ReactThreeFiber } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#4f46e5"),
    uColorB: new THREE.Color("#06b6d4"),
    uNoiseScale: 1.5,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `,
  `
    precision highp float;

    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uNoiseScale;
    varying vec2 vUv;

    // Simplex noise adapted from Ian McEwan, Ashima Arts.
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec2 mod289(vec2 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec3 permute(vec3 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                         -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);

      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;

      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));

      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;

      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;

      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float time = uTime * 0.05;
      float noise = snoise(vec2(uv.x * 0.6 + time, uv.y * 0.8 - time));
      float wave = snoise(vec2(uv.y * uNoiseScale + time, uv.x * 0.4 + time * 0.5));
      float intensity = smoothstep(-0.2, 0.6, noise + wave * 0.5);
      vec3 color = mix(uColorA, uColorB, intensity);
      gl_FragColor = vec4(color, 0.8);
    }
  `,
);

extend({ AuroraMaterial });

type AuroraMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
  uNoiseScale: number;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    auroraMaterial: ReactThreeFiber.MaterialNode<AuroraMaterialImpl, typeof AuroraMaterial>;
  }
}

const AuroraPlane = () => {
  const materialRef = useRef<AuroraMaterialImpl>(null);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta * 20;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[12, 12, 1, 1]} />
      <auroraMaterial ref={materialRef} />
    </mesh>
  );
};

export const AuroraBackground = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const gradientStyle = useMemo(
    () => ({
      background:
        "radial-gradient(circle at top left, rgba(99,102,241,0.45), transparent 55%), radial-gradient(circle at bottom right, rgba(56,189,248,0.45), transparent 60%)",
    }),
    [],
  );

  if (prefersReducedMotion) {
    return (
      <div
        className="absolute inset-0"
        style={gradientStyle}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 opacity-70">
      <Canvas camera={{ position: [0, 1.2, 5], fov: 55 }}>
        <color attach="background" args={["#05050a"]} />
        <ambientLight intensity={0.6} />
        <AuroraPlane />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
    </div>
  );
};
