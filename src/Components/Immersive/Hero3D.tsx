import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function Shield({ mouse }: { mouse: React.RefObject<THREE.Vector2> }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.3;
      const mx = mouse.current?.x ?? 0;
      const my = mouse.current?.y ?? 0;
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        my * 0.3,
        delta * 2
      );
      mesh.current.rotation.z = THREE.MathUtils.lerp(
        mesh.current.rotation.z,
        mx * -0.15,
        delta * 2
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={mesh} castShadow>
        <dodecahedronGeometry args={[1.8, 1]} />
        <MeshDistortMaterial
          color="#991b1b"
          emissive="#b91c1c"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.8}
          distort={0.2}
          speed={2}
        />
      </mesh>
      <mesh scale={2.1}>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshBasicMaterial
          color="#991b1b"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </Float>
  );
}

function Rings() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.x += delta * 0.15;
      group.current.rotation.y += delta * 0.1;
    }
  });

  const ringGeos = useMemo(() => {
    return [
      { radius: 2.8, tube: 0.02, color: "#991b1b", opacity: 0.3 },
      { radius: 3.2, tube: 0.015, color: "#b91c1c", opacity: 0.2 },
      { radius: 3.6, tube: 0.01, color: "#38bdf8", opacity: 0.1 },
    ];
  }, []);

  return (
    <group ref={group}>
      {ringGeos.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 3 + i * 0.4, i * 0.6, 0]}>
          <torusGeometry args={[r.radius, r.tube, 16, 100]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={r.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}

export { Shield, Rings };
