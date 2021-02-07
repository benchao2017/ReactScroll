import * as THREE from "three";
import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { Canvas, extend, useFrame, useThree } from "react-three-fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Flock } from "../flock";


// Makes these prototypes available as "native" jsx-string elements
extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  AfterimagePass,
  UnrealBloomPass
});

function Effect() {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size
  ]);
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size
  ]);
  useFrame(() => composer.current.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[aspect, 1.3, 1, 0]} />
      <shaderPass
        attachArray="passes"
        args={[FXAAShader]}
        uniforms-resolution-value={[1 / size.width, 1 / size.height]}
        renderToScreen
      />
    </effectComposer>
  );
}

function FlockAnimation() {
  const mouse = useRef([0, 0, false]);

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  const handleMouseDown = (event) => {
    if (event.button !== 2) {
      mouse.current[2] = true;
    }
  };

  const handleMouseUp = (event) => {
    if (event.button !== 2) {
      mouse.current[2] = false;
    }
  };

  return (
    <div
      style={{height:'100vh', marginTop:'50px'}}
      onMouseMove={onMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Canvas camera={{ fov: 75, position: [0, 0, 70] }}>
        <spotLight
          intensity={0.33}
          position={[0, 0, 70]}
          penumbra={1}
          color="lightblue"
        />
        <mesh>
          <planeBufferGeometry attach="geometry" args={[50000, 10000]} />
          <meshPhongMaterial
            attach="material"
            color="#272727"
            depthTest={false}
          />
        </mesh>
        <Flock mouse={mouse} count={600} />
        <Effect />
      </Canvas>
    </div>
  );
}

export default FlockAnimation;
