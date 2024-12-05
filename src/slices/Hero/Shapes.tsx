'use client';
import { useGSAP } from '@gsap/react';
import { ContactShadows, Environment, Float } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import gsap from 'gsap';
import { memo, Suspense, useRef, useState } from 'react';
import {
  CapsuleGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  Material,
  MeshNormalMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  PolyhedronGeometry,
  TorusGeometry,
} from 'three';

gsap.registerPlugin(useGSAP);

type Position = [number, number, number];
interface IGeometries {
  position: Position;
  r: number;
  geometry: PolyhedronGeometry | CapsuleGeometry | TorusGeometry;
}

interface IGeometryProps extends IGeometries {
  materials: Material[];
  soundEffects: HTMLAudioElement[];
}

const Shapes = memo(() => {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
});
Shapes.displayName = 'Shapes';
export default Shapes;

function Geometries() {
  const geometries: IGeometries[] = [
    { position: [0, 0, 0], r: 0.3, geometry: new IcosahedronGeometry(3) },
    {
      position: [1, -0.75, 4],
      r: 0.4,
      geometry: new CapsuleGeometry(0.5, 1.6, 2, 16),
    },
    {
      position: [-1.4, 2, -4],
      r: 0.6,
      geometry: new DodecahedronGeometry(1.5),
    },
    {
      position: [-0.8, -0.75, 5],
      r: 0.3,
      geometry: new TorusGeometry(0.6, 0.25, 16, 32),
    },
    { position: [1.6, 1.6, -4], r: 0.7, geometry: new OctahedronGeometry(1.5) },
  ];

  const materials = [
    new MeshNormalMaterial(),
    new MeshStandardMaterial({ color: 0x2ecc71, roughness: 0 }),
    new MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 }),
    new MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.1 }),
    new MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1 }),
    new MeshStandardMaterial({ color: 0x1abc9c, roughness: 0.1 }),
    new MeshStandardMaterial({
      color: 0x2980b9,
      roughness: 0,
      metalness: 0.1,
    }),
    new MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.1,
      metalness: 0.5,
    }),
  ];

  const soundEffects = [
    new Audio('/sounds/knock1.ogg'),
    new Audio('/sounds/knock2.ogg'),
    new Audio('/sounds/knock3.ogg'),
  ];

  //pass to Geometry
  return geometries.map(({ position, r, geometry }) => (
    <Geometry
      key={JSON.stringify(position)}
      materials={materials}
      soundEffects={soundEffects}
      position={position.map((p) => p * 2) as Position}
      r={r}
      geometry={geometry}
    />
  ));
}

function Geometry({
  materials,
  r,
  position,
  geometry,
  soundEffects,
}: IGeometryProps) {
  const meshRef = useRef<Group>(null);
  const [visible, setVisible] = useState(false);

  function getRandomMaterial() {
    return gsap.utils.random(materials);
  }

  function handleClick(e: ThreeEvent<MouseEvent>) {
    const mesh = e.object;
    gsap.utils.random(soundEffects).play();

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: 'elastic.out(1,0.3)',
      yoyo: true,
    });

    // @ts-expect-error ???
    mesh.material = getRandomMaterial();
  }

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
  };
  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  const startingMaterial = getRandomMaterial();

  useGSAP(() => {
    if (!meshRef.current) return;

    setVisible(true);

    gsap.from(meshRef.current.scale, {
      z: 0,
      y: 0,
      x: 0,
      duration: 1,
      ease: 'elastic.out(1,0.3)',
      delay: 0.3,
    });
  });

  return (
    <group position={position} ref={meshRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        />
      </Float>
    </group>
  );
}
