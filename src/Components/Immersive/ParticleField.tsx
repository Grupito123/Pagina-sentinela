import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 2000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    /* eslint-disable react-hooks/purity -- intentional: seeded once per mount for 3D particle field */
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sky = new THREE.Color("#991b1b");
    const cyan = new THREE.Color("#b91c1c");
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 8 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      tmp.copy(sky).lerp(cyan, Math.random());
      col[i3] = tmp.r;
      col[i3 + 1] = tmp.g;
      col[i3 + 2] = tmp.b;
    }
    return [pos, col];
    /* eslint-enable react-hooks/purity */
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.05;
      mesh.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={mesh} geometry={geo}>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  return <Particles count={2500} />;
}
