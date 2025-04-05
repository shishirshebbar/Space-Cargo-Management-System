import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

const CargoBay = () => {
  const { scene } = useGLTF("/models/cargo_bay.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Basic tweaks to prevent white/reflective look
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material.metalness = 0.1; // Less reflective
          child.material.roughness = 0.8; // More matte
          child.material.envMapIntensity = 0.3; // Reduce HDRI brightness effect

          // Optional: give it a base color if missing
          if (!child.material.map) {
            child.material.color.set("#aaa"); // light gray
          }
        }
      }
    });
  }, [scene]);

  return <primitive
  object={scene}
  scale={1.5}
  position={[0, -1, 0]}
  rotation={[-0.2, Math.PI / 2, 0]} // slight tilt up + 90° to the right
/>



;
};

export default CargoBay;

// import { useGLTF } from "@react-three/drei";
// import { useEffect } from "react";

// const CargoBay = () => {
//   const { scene } = useGLTF("/models/cargo_bay.glb");

//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh && child.material) {
//         child.castShadow = true;
//         child.receiveShadow = true;

//         child.material.metalness = 0.1;
//         child.material.roughness = 0.8;
//         child.material.envMapIntensity = 0.2;

//         // Give it a default color if too white
//         if (!child.material.map) {
//           child.material.color.set("#888888");
//         }
//       }
//     });
//   }, [scene]);

//   return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />;
// };

// export default CargoBay;
