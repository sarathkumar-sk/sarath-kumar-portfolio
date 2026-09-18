import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';

/*
  The hero robot, adapted from the React Bits RobotHero.

  What was taken: the robot itself, which is the part that was asked for.
  What was left behind: that component also ships an entire marketing hero,
  with its own sticky navbar, a "Buy Now" button, a shopping-bag icon and a
  giant watermark headline. Dropping it in whole would have given this
  portfolio a second navigation bar and an e-commerce call to action, so only
  the model is used and it sits in the same box the previous scene occupied.

  Three other changes:
  1. `Environment preset="studio"` fetches an HDRI from a CDN at runtime. This
     project carries no external asset requests, so the lighting is rebuilt
     from Lightformers, as in the scene this replaces.
  2. The screen and antenna tip were bright cyan, which would have been the
     only second hue on the page. They take the page accent instead.
  3. The key light's azimuth is driven by the page's scroll-linked sun value,
     so the robot is lit by the same light as every other surface.
*/

class HeartCurve extends THREE.Curve<THREE.Vector3> {
  // three marks Curve's constructor protected, so subclassing needs an
  // explicit public one before it can be instantiated.
  constructor() {
    super();
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(a), 3);
    const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    return optionalTarget.set(x * 0.002, (y + 6) * 0.002, 0);
  }
}

const sharedHeartCurve = new HeartCurve();
const ACCENT = '#f2711c';

const VERT_FRESNEL = [
  'varying vec3 vNormal;',
  'varying vec3 vViewPosition;',
  'void main() {',
  '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
  '  vViewPosition = -mvPosition.xyz;',
  '  vNormal = normalize(normalMatrix * normal);',
  '  gl_Position = projectionMatrix * mvPosition;',
  '}',
].join('\n');

const FRAG_FRESNEL = [
  'uniform vec3 color;',
  'uniform float power;',
  'uniform float intensity;',
  'varying vec3 vNormal;',
  'varying vec3 vViewPosition;',
  'void main() {',
  '  vec3 normal = normalize(vNormal);',
  '  vec3 viewDir = normalize(vViewPosition);',
  '  float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);',
  '  fresnel = pow(fresnel, power);',
  '  gl_FragColor = vec4(color, fresnel * intensity);',
  '}',
].join('\n');

function ResponsiveGroup({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
  const { viewport } = useThree();
  const s = Math.min(1.1, viewport.width / 3.5) * scale;
  return <group scale={s}>{children}</group>;
}

function GlassCapsule({ color, power, intensity }: { color: string; power: number; intensity: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color('#ffffff') },
      power: { value: 2.5 },
      intensity: { value: 0.6 },
    }),
    [],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.color.value.set(color);
      materialRef.current.uniforms.power.value = power;
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.3, 64, 64, 0, Math.PI * 2, 0, Math.PI]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={VERT_FRESNEL}
        fragmentShader={FRAG_FRESNEL}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const earBaseMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.5 });
const earRingMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.3 });
const earCenterMat = new THREE.MeshStandardMaterial({ color: '#cccccc', roughness: 0.8 });
const antennaBaseMat = new THREE.MeshStandardMaterial({ color: '#999999', roughness: 0.4, metalness: 0.5 });
const antennaStickMat = new THREE.MeshStandardMaterial({ color: '#d0d0d0', roughness: 0.4, metalness: 0.2 });
const antennaTipMat = new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.2, toneMapped: false });

function RobotEar({
  position,
  scale = 1,
  isLeft = false,
}: {
  position: [number, number, number];
  scale?: number;
  isLeft?: boolean;
}) {
  const dir = isLeft ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earBaseMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.025, 32]} />
      </mesh>
      <mesh position={[dir * 0.012, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={earRingMat}>
        <torusGeometry args={[0.032, 0.008, 16, 32]} />
      </mesh>
      <mesh
        position={[dir * 0.012, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
        material={earCenterMat}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.005, 32]} />
      </mesh>
      <group position={[dir * 0.015, 0.035, 0]} rotation={[-0.4, 0, 0]}>
        <mesh position={[0, 0.01, 0]} castShadow receiveShadow material={antennaBaseMat}>
          <cylinderGeometry args={[0.006, 0.008, 0.02, 16]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow receiveShadow material={antennaStickMat}>
          <cylinderGeometry args={[0.003, 0.003, 0.1, 8]} />
        </mesh>
        <mesh position={[0, 0.11, 0]} castShadow receiveShadow material={antennaTipMat}>
          <sphereGeometry args={[0.006, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}

const eyeMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color(2, 2, 2),
  toneMapped: false,
  transparent: true,
});
const heartMat = new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false });

function RobotEye({
  position,
  rotation,
  scale = 1,
  blinkDuration = 0.15,
  blinkCycle = 3.0,
  isLovedRef,
  animate,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  blinkDuration?: number;
  blinkCycle?: number;
  isLovedRef: React.MutableRefObject<boolean>;
  animate: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const normalEyesRef = useRef<THREE.Group>(null);
  const heartEyeRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current || !normalEyesRef.current || !heartEyeRef.current) return;

    const isHeart = isLovedRef.current;
    normalEyesRef.current.visible = !isHeart;
    heartEyeRef.current.visible = isHeart;

    let targetScaleY = 1;
    if (animate) {
      const cycle = clock.getElapsedTime() % blinkCycle;
      if (cycle < blinkDuration && !isHeart) {
        const progress = cycle / blinkDuration;
        targetScaleY = Math.max(0.05, 1.0 - Math.sin(progress * Math.PI));
      }
    }

    groupRef.current.scale.set(scale, scale * targetScaleY, scale);
  });

  const { topPath, bottomPath } = useMemo(() => {
    const w = 0.025;
    const h = 0.035;
    const r = 0.02;
    const g = 0.005;
    const v = (x: number, y: number) => new THREE.Vector3(x, y, 0);

    const tPath = new THREE.CurvePath<THREE.Vector3>();
    tPath.add(new THREE.LineCurve3(v(-w, g), v(-w, h - r)));
    tPath.add(new THREE.QuadraticBezierCurve3(v(-w, h - r), v(-w, h), v(-w + r, h)));
    tPath.add(new THREE.LineCurve3(v(-w + r, h), v(w - r, h)));
    tPath.add(new THREE.QuadraticBezierCurve3(v(w - r, h), v(w, h), v(w, h - r)));
    tPath.add(new THREE.LineCurve3(v(w, h - r), v(w, g)));

    const bPath = new THREE.CurvePath<THREE.Vector3>();
    bPath.add(new THREE.LineCurve3(v(-w, -g), v(-w, -(h - r))));
    bPath.add(new THREE.QuadraticBezierCurve3(v(-w, -(h - r)), v(-w, -h), v(-w + r, -h)));
    bPath.add(new THREE.LineCurve3(v(-w + r, -h), v(w - r, -h)));
    bPath.add(new THREE.QuadraticBezierCurve3(v(w - r, -h), v(w, -h), v(w, -(h - r))));
    bPath.add(new THREE.LineCurve3(v(w, -(h - r)), v(w, -g)));

    return { topPath: tPath, bottomPath: bPath };
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <mesh ref={heartEyeRef} visible={false} material={heartMat}>
        <tubeGeometry args={[sharedHeartCurve, 64, 0.0035, 8, true]} />
      </mesh>
      <group ref={normalEyesRef}>
        <mesh material={eyeMat}>
          <tubeGeometry args={[topPath, 20, 0.0035, 8, false]} />
        </mesh>
        <mesh material={eyeMat}>
          <tubeGeometry args={[bottomPath, 20, 0.0035, 8, false]} />
        </mesh>
      </group>
    </group>
  );
}

const BODY_R = 0.43;
const HEAD_R = 0.28;
const HEAD_Y = 0.6;

const NECK = {
  baseR: 0.215,
  baseH: -0.05,
  midR: 0.28,
  midH: 0.02,
  lipBottomR: 0.295,
  lipBottomH: 0.045,
  lipTopR: 0.27,
  lipTopH: 0.055,
  innerR: 0.1,
  innerDropH: 0.0,
};
const BODY = { bevelR: 0.235, bevelY: 0.34, bevelT: 0.025 };

/*
  Brushed finish. Fine concentric streaks in a roughness map, which catches the
  light in bands the way turned metal does. It is a roughness map only, so the
  silhouette and colour stay clean; the earlier speckle map painted grain into
  the colour channel and read as sand.
*/
function createBrushedRoughness() {
  const w = 512;
  const h = 128;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#7a7a7a';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const y = Math.random() * h;
      const v = 96 + Math.floor(Math.random() * 70);
      ctx.strokeStyle = `rgb(${v},${v},${v})`;
      ctx.lineWidth = Math.random() < 0.7 ? 0.6 : 1.2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y + (Math.random() - 0.5) * 2);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  tex.needsUpdate = true;
  return tex;
}
const MOTION = {
  moveSpeed: 4.5,
  bodyRotSpeed: 10.0,
  headRotSpeed: 20.0,
  bodyTiltY: 0.95,
  headLookX: 0.3,
  headLookY: 1.8,
};

function RobotPrototype({ color, dark, animate }: { color: string; dark: boolean; animate: boolean }) {
  const isLovedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!bodyRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);
    const tx = state.pointer.x;
    const ty = state.pointer.y;

    // Faster follow needs a shorter runway, or the body reaches the end of
    // its travel and leaves the frame entirely.
    const maxMoveX = state.viewport.width / 9;
    bodyRef.current.position.x = THREE.MathUtils.lerp(
      bodyRef.current.position.x,
      tx * maxMoveX,
      MOTION.moveSpeed * dt,
    );

    const relativeX = tx - bodyRef.current.position.x / 2.5;

    bodyRef.current.rotation.y = THREE.MathUtils.lerp(
      bodyRef.current.rotation.y,
      -relativeX * MOTION.bodyTiltY,
      MOTION.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.x = THREE.MathUtils.lerp(
      bodyRef.current.rotation.x,
      -ty * 0.25,
      MOTION.bodyRotSpeed * dt,
    );
    bodyRef.current.rotation.z = THREE.MathUtils.lerp(
      bodyRef.current.rotation.z,
      -relativeX * 0.15,
      MOTION.bodyRotSpeed * dt,
    );

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      relativeX * MOTION.headLookY,
      MOTION.headRotSpeed * dt,
    );
    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      -ty * MOTION.headLookX,
      MOTION.headRotSpeed * dt,
    );
  });

  useEffect(() => {
    const timeout = timeoutRef;
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      document.body.style.cursor = 'auto';
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isLovedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isLovedRef.current = false;
    }, 2000);
  };

  const neckProfile = useMemo(
    () => [
      new THREE.Vector2(NECK.innerR, NECK.baseH),
      new THREE.Vector2(NECK.baseR, NECK.baseH),
      new THREE.Vector2(NECK.midR, NECK.midH),
      new THREE.Vector2(NECK.lipBottomR, NECK.lipBottomH),
      new THREE.Vector2(NECK.lipTopR, NECK.lipTopH),
      new THREE.Vector2(NECK.innerR, NECK.lipTopH),
      new THREE.Vector2(NECK.innerR, NECK.lipTopH - NECK.innerDropH),
    ],
    [],
  );

  const headMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#111111', roughness: 1.0, metalness: 0.0 }),
    [],
  );

  const roughnessMap = useMemo(() => createBrushedRoughness(), []);

  useEffect(() => () => roughnessMap.dispose(), [roughnessMap]);

  const chassisMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughnessMap,
        roughness: 0.55,
        metalness: 0.9,
        envMapIntensity: dark ? 1.35 : 1.6,
      }),
    [color, dark, roughnessMap],
  );

  return (
    <group
      ref={bodyRef}
      position={[0, -0.3, 0]}
      onPointerDown={handlePointerDown}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <mesh castShadow receiveShadow material={chassisMat}>
        <sphereGeometry args={[BODY_R, 96, 96, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.85]} />
      </mesh>

      <mesh position={[0, BODY.bevelY, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow material={chassisMat}>
        <torusGeometry args={[BODY.bevelR, BODY.bevelT, 32, 64]} />
      </mesh>

      <mesh position={[0, 0.38, 0]} receiveShadow castShadow material={chassisMat}>
        <latheGeometry args={[neckProfile, 64]} />
      </mesh>

      <group ref={headRef} position={[0, HEAD_Y, 0]}>
        <mesh material={headMat} castShadow receiveShadow>
          <sphereGeometry args={[HEAD_R, 96, 96]} />
        </mesh>

        <GlassCapsule color={ACCENT} power={3.8} intensity={dark ? 1.35 : 1.0} />

        <group position={[0, -0.02, 0.29]}>
          <RobotEye
            position={[-0.07, 0, 0]}
            rotation={[0, -0.2, 0]}
            scale={1.1}
            blinkDuration={0.45}
            blinkCycle={3}
            isLovedRef={isLovedRef}
            animate={animate}
          />
          <RobotEye
            position={[0.07, 0, 0]}
            rotation={[0, 0.2, 0]}
            scale={1.1}
            blinkDuration={0.45}
            blinkCycle={3}
            isLovedRef={isLovedRef}
            animate={animate}
          />
        </group>

        <RobotEar position={[-0.29, 0, 0]} isLeft scale={1.3} />
        <RobotEar position={[0.29, 0, 0]} scale={1.3} />
      </group>
    </group>
  );
}

const Sun = ({ sun, dark }: { sun: MotionValue<number>; dark: boolean }) => {
  const light = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const t = sun.get();
    const azimuth = THREE.MathUtils.lerp(1.15, -1.25, t);
    const height = THREE.MathUtils.lerp(4.6, 1.6, t);
    if (light.current) {
      light.current.position.set(Math.sin(azimuth) * 5, height, Math.cos(azimuth) * 3.4);
      light.current.intensity = THREE.MathUtils.lerp(dark ? 2.2 : 2.8, dark ? 1.1 : 1.6, t);
    }
  });

  return (
    <directionalLight
      ref={light}
      castShadow
      color={dark ? '#ffcda3' : '#fff3e2'}
      shadow-mapSize={[1024, 1024]}
      shadow-bias={-0.0005}
    >
      <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 20]} />
    </directionalLight>
  );
};

const RobotScene = ({ sun, dark, animate }: { sun: MotionValue<number>; dark: boolean; animate: boolean }) => (
  <Canvas
    shadows
    dpr={[1, 1.75]}
    frameloop={animate ? 'always' : 'demand'}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    camera={{ position: [0, 0.25, 5.2], fov: 40 }}
  >
    <ambientLight intensity={dark ? 0.55 : 0.9} color="#ffffff" />
    <Sun sun={sun} dark={dark} />

    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={dark ? 3.5 : 6}
        color={dark ? '#ffd9bb' : '#fff6ec'}
        position={[4, 4, 4]}
        scale={[6, 6, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={dark ? 1.6 : 3}
        color={dark ? '#33415c' : '#cfe0f5'}
        position={[-5, 2, -4]}
        scale={[8, 8, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={dark ? 0.9 : 1.8}
        color="#ffffff"
        position={[0, -3, 4]}
        scale={[10, 10, 1]}
        target={[0, 0, 0]}
      />
    </Environment>

    <ResponsiveGroup scale={1.45}>
      <ContactShadows
        position={[0, -0.79, 0]}
        opacity={dark ? 0.6 : 0.4}
        scale={12}
        resolution={1024}
        blur={2.2}
        far={2.5}
        color={dark ? '#000000' : '#1b2430'}
      />
      <RobotPrototype color={dark ? '#6d7580' : '#78818d'} dark={dark} animate={animate} />
    </ResponsiveGroup>
  </Canvas>
);

export default RobotScene;
