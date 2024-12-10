import { useRef } from 'react';
import * as THREE from 'three';

const D20: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      {/* D20 Geometry */}
      <icosahedronGeometry args={[1, 0]} />
      {/* Material */}
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default D20;
