// import React, { useRef, useEffect } from "react";
// import * as THREE from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// function ThreeEg() {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);

//   useEffect(() => {
//     const currentRef = mountRef.current;
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       currentRef.clientWidth / currentRef.clientHeight,
//       0.1,
//       1000
//     );
//     cameraRef.current = camera;
//     camera.position.set(10, 10, 20); // Default position
//     camera.lookAt(0, 0, 0);

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
//     renderer.setClearColor(0xFFC0CB);
//     currentRef.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controlsRef.current = controls;

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     const light = new THREE.AmbientLight(0x404040);
//     scene.add(light);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(1, 1, 1).normalize();
//     scene.add(directionalLight);

//     return () => {
//       currentRef.removeChild(renderer.domElement);
//       controls.dispose();
//     };
//   }, []);

//   const onFileChange = (event) => {
//     const files = event.target.files;
//     Array.from(files).forEach(file => {
//       if (file) {
//         const loader = new FBXLoader();
//         loader.load(
//           URL.createObjectURL(file),
//           (object) => {
//             console.log('Loaded FBX object:', object);
//             object.position.set(0, 0, 0); // Center the model
//             sceneRef.current.add(object);
  
//             // Adjust camera to fit the object after loading multiple objects
//             const box = new THREE.Box3().setFromObject(sceneRef.current);
//             const center = box.getCenter(new THREE.Vector3());
//             const size = box.getSize(new THREE.Vector3());
//             const maxDim = Math.max(size.x, size.y, size.z);
//             const fov = cameraRef.current.fov * (Math.PI / 180);
//             let cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));
//             cameraZ *= 1; // Adjust this factor as needed
            
//             cameraRef.current.position.z = center.z + cameraZ;
//             cameraRef.current.position.x = center.x;
//             cameraRef.current.position.y = center.y;
//             cameraRef.current.lookAt(center);
//             controlsRef.current.update();
  
//           },
//           undefined,
//           (error) => {
//             console.error('Error loading FBX model:', error);
//           }
//         );
//       }
//     });
//   };
  

//   return (
//     <div>
//   <input type="file" onChange={onFileChange} accept=".fbx" multiple />
//   <div className="canvas" ref={mountRef} style={{ width: "1000px", height: "600px" }} />
// </div>

//   );
// }

// export default ThreeEg;