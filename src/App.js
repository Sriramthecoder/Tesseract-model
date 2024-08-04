import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Define edges between the vertices of a tesseract
const edges = [
  [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7],
  [4, 5], [4, 6], [5, 7], [6, 7], [8, 9], [8, 10], [8, 12], [9, 11],
  [9, 13], [10, 11], [10, 14], [11, 15], [12, 13], [12, 14], [13, 15],
  [14, 15], [0, 8], [1, 9], [2, 10], [3, 11], [4, 12], [5, 13], [6, 14], [7, 15]
];

function Tesseract() {
  const ref = useRef()

  // Animation loop to rotate the tesseract
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
      ref.current.rotation.z += 0.01;
    }
  })

  // Define the vertices of the tesseract
  const vertices = [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
    [2, 2, 2], [2, 2, -2], [2, -2, 2], [2, -2, -2],
    [-2, 2, 2], [-2, 2, -2], [-2, -2, 2], [-2, -2, -2]
  ];

  return (
    <group ref={ref}>
      
      {/* Draw cubes representing vertices */}
      {vertices.map((position, index) => (
        <mesh key={index} position={position} scale={0.5}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={'cyan'} />
        </mesh>
      ))}

      {/* Connect vertices with cylinders */}
      {edges.map(([startIndex, endIndex], index) => {
        const start = new THREE.Vector3(...vertices[startIndex]);
        const end = new THREE.Vector3(...vertices[endIndex]);
        const length = start.distanceTo(end);
        const mid = start.clone().add(end).multiplyScalar(0.5);

        const direction = end.clone().sub(start).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const rotationAxis = new THREE.Vector3().crossVectors(up, direction).normalize();
        const angle = Math.acos(up.dot(direction));
        const rotation = new THREE.Quaternion().setFromAxisAngle(rotationAxis, angle);

        return (
          <mesh key={index} position={mid} rotation={rotation.random()}>
            <cylinderGeometry args={[0.05, 0.05, length]} />
            <meshStandardMaterial 
              color={ 'cyan' } 
              emissive={ 'cyan'} 
              emissiveIntensity={1} 
              transparent={true} 
              opacity={0.7} 
            />
          </mesh>
        );
      })}
    </group>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#111' }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={1} />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={1} />
        <Tesseract />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
