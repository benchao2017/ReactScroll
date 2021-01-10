import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Helmet } from "react-helmet";
import * as THREE from "three";
import "./styles.css";

const numParticles = 2500;

const Map = (props) => {
  const nodes = useRef([]);
  const scale = useRef([]);
  const waves = useRef();

  const { positions, scales } = useMemo(() => {
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0,
      j = 0;

    for (var ix = 0; ix < 50; ix++) {
      for (var iy = 0; iy < 50; iy++) {
        positions[i] = ix * 100 - (50 * 100) / 2; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * 100 - (50 * 100) / 2; // z

        scales[j] = 1;

        i += 3;
        j++;
      }
    }
    return { positions, scales };
  }, []);
  nodes.current = positions;
  scale.current = scales;

  useFrame(({ clock }) => {
    const positions = waves.current.__objects[0].attributes.position.array;
    const scales = waves.current.__objects[0].attributes.scale.array;

    let i = 0,
      j = 0;

    for (var ix = 0; ix < 50; ix++) {
      for (var iy = 0; iy < 50; iy++) {
        positions[i + 1] =
          Math.sin((ix + clock.elapsedTime) * 0.3) * 50 +
          Math.sin((iy + clock.elapsedTime) * 0.5) * 50;

        scales[j] =
          (Math.sin((ix + clock.elapsedTime) * 0.3) + 1) * 8 +
          (Math.sin((iy + clock.elapsedTime) * 0.5) + 1) * 8;

        i += 3;
        j++;
      }
    }
    waves.current.__objects[0].attributes.position.needsUpdate = true;
    waves.current.__objects[0].attributes.scale.needsUpdate = true;
  });

  return (
    <points {...props} ref={waves}>
      <bufferGeometry attach={"geometry"}>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          array={nodes.current}
          count={nodes.current.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attachObject={["attributes", "scale"]}
          array={scale.current}
          count={scale.current.length}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        args={[
          {
            uniforms: {
              color: { value: new THREE.Color("#b37cbd") }
            },
            vertexShader: document.getElementById("vertexshader").textContent,
            fragmentShader: document.getElementById("fragmentshader")
              .textContent
          }
        ]}
      />
    </points>
  );
};

export default function App() {
  return (
    <>
      <Helmet>
        <script type="x-shader/x-vertex" id="vertexshader">
          {`attribute float scale;\nvoid main() {\n\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\tgl_PointSize = scale * ( 300.0 / - mvPosition.z );\n\tgl_Position = projectionMatrix * mvPosition;\n}`}
        </script>

        <script type="x-shader/x-fragment" id="fragmentshader">
          {`uniform vec3 color;\nvoid main() {\n\tif ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;\n\tgl_FragColor = vec4( color, 1.0 );\n}`}
        </script>
      </Helmet>

      <div className="App">
        <Canvas gl camera={{ position: [0, 500, 1000], far: 10000 }}>
          <Map />
        </Canvas>
      </div>
    </>
  );
}
