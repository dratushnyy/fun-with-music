import React, {useEffect} from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { NOTE_COLORS } from './constants';



const Note = ({ note, index }) => {
  const angle = (2 * Math.PI * index) / 12;
  const radius = 5;
  const height = index /3;

  const colors = note.split('\\');
  const materials = colors.map(color => ({ color: NOTE_COLORS[color] }));

  return (
    <>
      <mesh
        position={[
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ]}
        rotation={[0, colors.length > 1 ? Math.PI / 2 : 0, 0]}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        {materials.map((material, idx) => (
          <meshBasicMaterial attachArray="material" key={idx} {...material} />
        ))}
      </mesh>
    </>
  );
};

const ChromaticSpiral = () => {
  const chromaticScale = [
    'C', 'C#\\Db', 'D', 'D#\\Eb', 'E', 'F',
    'F#\\Gb', 'G', 'G#\\Ab', 'A', 'A#\\Bb', 'B'
  ];

  const octaves = 7;
  const spiralNotes = Array.from({ length: octaves }, (_, octave) =>
    chromaticScale.map((note, index) => ({ note, index: index + octave * 12 }))
  ).flat();

  return (
    <group>
      {spiralNotes.map(({ note, index }) => (
        <Note key={index} note={note} index={index} />
      ))}
    </group>
  );
};

const RotatingScene = ({ children }) => {
  const ref = React.useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y -= 0.01;
    }
  });

  return <group ref={ref}>{children}</group>;
};

const CanvasSize = ({ width, height }) => {
  const { gl, camera, size } = useThree();

  useEffect(() => {
    if (width && height) {
      gl.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    } else {
      gl.setSize(size.width, size.height);
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [width, height, gl, camera, size]);

  return null;
};

function App() {
  return (
    <div className="container">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 20, 50], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <RotatingScene>
            <ChromaticSpiral />
          </RotatingScene>
          <CanvasSize width={1000} height={900} />
        </Canvas>
      </div>
    </div>
  );
}

export default App
