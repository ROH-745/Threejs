// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import "./App.css";
// // import myImg from '\vite.svg'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faEyeSlash, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';


// function FBXViewer() {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const cameraRef = useRef(
//     new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     )
//   );

  

//   const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
//   const controlsRef = useRef(null);
//   const cumulativeBoundingBox = useRef(
//     new THREE.Box3(
//       new THREE.Vector3(Infinity, Infinity, Infinity),
//       new THREE.Vector3(-Infinity, -Infinity, -Infinity)
//     )
//   );

//   const [isVisible, setIsVisible] = useState(true);  // State to control visibility

//   useEffect(() => {
//     rendererRef.current.setSize(window.innerWidth, window.innerHeight);
//     rendererRef.current.setClearColor(0xd3d3d3); // Light grey background color
//     rendererRef.current.gammaOutput = true; // Ensure correct color management
//     rendererRef.current.gammaFactor = 2.2; // Good default gamma factor
//     mountRef.current.appendChild(rendererRef.current.domElement);

//     // Add lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     sceneRef.current.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(0, 1, 0);
//     sceneRef.current.add(directionalLight);

//     controlsRef.current = new OrbitControls(
//       cameraRef.current,
//       rendererRef.current.domElement
//     );
//     controlsRef.current.enableDamping = true;
//     controlsRef.current.dampingFactor = 0.1;

//     animate();

//     return () => {
//       mountRef.current.removeChild(rendererRef.current.domElement);
//       controlsRef.current.dispose();
//     };
//   }, []);

//   const loadModels = (files) => {
//     const loader = new FBXLoader();
//     let loadedCount = 0;
//     const totalFiles = files.length;
//     const objects = [];

//     Array.from(files).forEach((file) => {
//       loader.load(
//         URL.createObjectURL(file),
//         (object) => {
//           // Adjust materials to ensure they react to light
//           object.traverse((child) => {
//             if (child.isMesh && child.material) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: child.material.color,
//                 map: child.material.map, // Keep the texture if any
//               });
//             }
//           });

//           objects.push(object);
//           const boundingBox = new THREE.Box3().setFromObject(object);
//           cumulativeBoundingBox.current.union(boundingBox);
//           loadedCount++;
//           console.log(boundingBox);

//           if (loadedCount === totalFiles) {
//             // All files have been loaded, add them to the scene
//             objects.forEach((obj) => sceneRef.current.add(obj));
//             adjustCamera(); // Adjust the camera once after all models have been loaded
//           }
//         },
//         undefined,
//         (error) => {
//           console.error("Error loading model:", error);
//         }
//       );
//     });
//   };

//   const adjustCamera = () => {
//     const center = new THREE.Vector3();
//     cumulativeBoundingBox.current.getCenter(center);
//     const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
//     const distance = size.length();
//     const fov = cameraRef.current.fov * (Math.PI / 180);
//     let cameraZ = distance / (2 * Math.tan(fov / 2));
//     cameraZ *= 2.5; // Adjust multiplier to ensure all models are visible

//     cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
//     cameraRef.current.lookAt(center);
//     controlsRef.current.target.copy(center);
//     controlsRef.current.update();
//   };

//   const onFileChange = (event) => {
//     // Reset cumulative bounding box for new set of files
//     cumulativeBoundingBox.current = new THREE.Box3(
//       new THREE.Vector3(Infinity, Infinity, Infinity),
//       new THREE.Vector3(-Infinity, -Infinity, -Infinity)
//     );
//     loadModels(event.target.files);
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (isVisible) {  // Only update controls and render if visible
//         controlsRef.current.update();
//         rendererRef.current.render(sceneRef.current, cameraRef.current);
//     }
// };


//   const toggleVisibility = (visible) => {
//     setIsVisible(visible);
//     sceneRef.current.traverse(function (object) {
//         if (object instanceof THREE.Mesh) {
//             object.visible = visible;
//         }
//     });
// };
  

//   const resetCameraView = () => {
//     const center = new THREE.Vector3();
//     cumulativeBoundingBox.current.getCenter(center);
//     const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
//     const distance = size.length();
//     const fov = cameraRef.current.fov * (Math.PI / 180);
//     let cameraZ = distance / (2 * Math.tan(fov / 2));
//     cameraZ *= 2.5;  // Adjust to ensure all models are visible

//     cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
//     cameraRef.current.lookAt(center);
//     controlsRef.current.target.copy(center);
//     controlsRef.current.update();
// };



//   return (
//     <div className="main">
//     <div className="canvas-container">
//         <input
//             className="button"
//             type="file"
//             multiple
//             onChange={onFileChange}
//             accept=".fbx"
//         />
//         <div ref={mountRef} style={{ width: "99%", height: "100vh" }}></div>
//     </div>

//     <div className="button-container">
//         <button className="custom-button hide-show" onClick={() => toggleVisibility(true)}>
//           <FontAwesomeIcon icon={faEye}  />
//           </button>
//           <button className="custom-button"   onClick={() => toggleVisibility(false)}>
//           <FontAwesomeIcon icon={faEyeSlash} />
//           </button>
       
          
          
            
        
//         <button className="custom-button fit-view" onClick={resetCameraView}>
//         <FontAwesomeIcon icon={faSearch}  />
          
//         </button>
//     </div>
// </div>

//   );
// }

// export default FBXViewer;










// CUBE BOUNDING BOX


// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { openDB } from "idb";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEyeSlash, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
// import "./App.css";

// function FBXViewer() {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
//   const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
//   const controlsRef = useRef(null);
//   const cumulativeBoundingBox = useRef(new THREE.Box3(new THREE.Vector3(Infinity, Infinity, Infinity), new THREE.Vector3(-Infinity, -Infinity, -Infinity)));
//   const [isVisible, setIsVisible] = useState(true);
//   const [db, setDb] = useState(null);
//   const [boundingBoxes, setBoundingBoxes] = useState([]); // State to store bounding boxes

//   useEffect(() => {
//     const initDB = async () => {
//       const database = await openDB('fbx-files-db', 1, {
//         upgrade(db) {
//           if (!db.objectStoreNames.contains('files')) {
//             db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
//           }
//         },
//       });
//       await clearDatabase(database);
//       setDb(database);
//       await loadModelsFromDB(database);
//     };

//     initDB();

//     rendererRef.current.setSize(window.innerWidth, window.innerHeight);
//     rendererRef.current.setClearColor(0xd3d3d3);
//     rendererRef.current.gammaOutput = true;
//     rendererRef.current.gammaFactor = 2.2;
//     mountRef.current.appendChild(rendererRef.current.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     sceneRef.current.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(0, 1, 0);
//     sceneRef.current.add(directionalLight);

//     controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
//     controlsRef.current.enableDamping = true;
//     controlsRef.current.dampingFactor = 0.1;

//     animate();

//     return () => {
//       mountRef.current.removeChild(rendererRef.current.domElement);
//       controlsRef.current.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     // Log the boundingBoxes state whenever it changes
//     console.log('Bounding Boxes:', boundingBoxes);
//   }, [boundingBoxes]);

//   const clearDatabase = async (database) => {
//     const tx = database.transaction('files', 'readwrite');
//     const store = tx.objectStore('files');
//     await store.clear();
//     await tx.done;
//     // console.log('Database cleared');
//   };

//   const loadModels = async (files) => {
//     const loader = new FBXLoader();
//     const objects = [];

//     Array.from(files).forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         const result = event.target.result;
//         const arrayBuffer = result;

//         if (db) {
//           await db.put('files', { id: file.name, data: arrayBuffer });
//           console.log(`Stored file: ${file.name}`);
//           loadModelsFromDB(db);
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   const loadModelsFromDB = async (database) => {
//     const loader = new FBXLoader();
//     const tx = database.transaction('files', 'readonly');
//     const store = tx.objectStore('files');
//     const allFiles = await store.getAll();
//     const objects = [];

//     for (const file of allFiles) {
//       const arrayBuffer = file.data;

//       loader.load(
//         URL.createObjectURL(new Blob([arrayBuffer])),
//         (object) => {
//           object.traverse((child) => {
//             if (child.isMesh && child.material) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: child.material.color,
//                 map: child.material.map,
//               });
//             }
//           });

//           objects.push(object);
//           const boundingBox = new THREE.Box3().setFromObject(object);
//           cumulativeBoundingBox.current.union(boundingBox);
//           sceneRef.current.add(object);

//           setBoundingBoxes((prev) => {
//             const updatedBoundingBoxes = [...prev, boundingBox];
//             createBoundingBoxCubes(updatedBoundingBoxes); // Call function to create cubes
//             return updatedBoundingBoxes;
//           });

//           adjustCamera();
//         },
//         undefined,
//         (error) => {
//           console.error("Error loading model:", error);
//         }
//       );
//     }
//   };

//   const createBoundingBoxCubes = (updatedBoundingBoxes) => {
//     updatedBoundingBoxes.forEach((boundingBox) => {
//       const helper = new THREE.Box3Helper(boundingBox, 0x00ff00);
//       sceneRef.current.add(helper);
//     });
//   };

//   const adjustCamera = () => {
//     const center = new THREE.Vector3();
//     cumulativeBoundingBox.current.getCenter(center);
//     const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
//     const distance = size.length();
//     const fov = cameraRef.current.fov * (Math.PI / 180);
//     let cameraZ = distance / (2 * Math.tan(fov / 2));
//     cameraZ *= 2.5;

//     cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
//     cameraRef.current.lookAt(center);
//     controlsRef.current.target.copy(center);
//     controlsRef.current.update();
//   };

//   const onFileChange = (event) => {
//     cumulativeBoundingBox.current = new THREE.Box3(
//       new THREE.Vector3(Infinity, Infinity, Infinity),
//       new THREE.Vector3(-Infinity, -Infinity, -Infinity)
//     );
//     setBoundingBoxes([]); // Reset bounding boxes state
//     loadModels(event.target.files);
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (isVisible) {
//       controlsRef.current.update();
//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     }
//   };

//   const toggleVisibility = (visible) => {
//     setIsVisible(visible);
//     sceneRef.current.traverse(function (object) {
//       if (object instanceof THREE.Mesh) {
//         object.visible = visible;
//       }
//     });
//   };

//   const resetCameraView = () => {
//     const center = new THREE.Vector3();
//     cumulativeBoundingBox.current.getCenter(center);
//     const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
//     const distance = size.length();
//     const fov = cameraRef.current.fov * (Math.PI / 180);
//     let cameraZ = distance / (2 * Math.tan(fov / 2));
//     cameraZ *= 2.5;

//     cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
//     cameraRef.current.lookAt(center);
//     controlsRef.current.target.copy(center);
//     controlsRef.current.update();
//   };

//   return (
//     <div className="main">
//       <div className="canvas-container">
//         <input
//           className="button"
//           type="file"
//           multiple
//           onChange={onFileChange}
//           accept=".fbx"
//         />
//         <div ref={mountRef} style={{ width: "99%", height: "100vh" }}></div>
//       </div>
//       <div className="button-container">
//         <button className="custom-button hide-show" onClick={() => toggleVisibility(true)}>
//           <FontAwesomeIcon icon={faEye} />
//         </button>
//         <button className="custom-button" onClick={() => toggleVisibility(false)}>
//           <FontAwesomeIcon icon={faEyeSlash} />
//         </button>
//         <button className="custom-button fit-view" onClick={resetCameraView}>
//           <FontAwesomeIcon icon={faSearch} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default FBXViewer;









// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { openDB } from "idb";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEyeSlash, faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
// import "./App.css";

// function FBXViewer() {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(new THREE.Scene());
//   const cameraRef = useRef(
//     new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     )
//   );
//   const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
//   const controlsRef = useRef(null);
//   const cumulativeBoundingBox = useRef(
//     new THREE.Box3(
//       new THREE.Vector3(Infinity, Infinity, Infinity),
//       new THREE.Vector3(-Infinity, -Infinity, -Infinity)
//     )
//   );
//   const [isVisible, setIsVisible] = useState(true);
//   const [db, setDb] = useState(null);
//   const [boundingBoxes, setBoundingBoxes] = useState([]); // State to store bounding boxes

//   useEffect(() => {
//     const initDB = async () => {
//       const database = await openDB("fbx-files-db", 1, {
//         upgrade(db) {
//           if (!db.objectStoreNames.contains("files")) {
//             db.createObjectStore("files", {
//               keyPath: "id",
//               autoIncrement: true,
//             });
//           }
//         },
//       });
//       await clearDatabase(database);
//       setDb(database);
//       await loadModelsFromDB(database);
//     };

//     initDB();

//     rendererRef.current.setSize(window.innerWidth, window.innerHeight);
//     rendererRef.current.setClearColor(0xd3d3d3);
//     rendererRef.current.gammaOutput = true;
//     rendererRef.current.gammaFactor = 2.2;
//     mountRef.current.appendChild(rendererRef.current.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     sceneRef.current.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(0, 1, 0);
//     sceneRef.current.add(directionalLight);
//     controlsRef.current = new OrbitControls(
//       cameraRef.current,
//       rendererRef.current.domElement
//     );
//     controlsRef.current.enableDamping = true;
//     controlsRef.current.dampingFactor = 0.1;
//     sceneRef.Near;

//     animate();

//     return () => {
//       mountRef.current.removeChild(rendererRef.current.domElement);
//       controlsRef.current.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     // Log the boundingBoxes state whenever it changes
//     console.log("Bounding Boxes:", boundingBoxes);
//   }, [boundingBoxes]);

//   const clearDatabase = async (database) => {
//     const tx = database.transaction("files", "readwrite");
//     const store = tx.objectStore("files");
//     await store.clear();
//     await tx.done;
//     // console.log('Database cleared');
//   };

//   const loadModels = async (files) => {
//     const loader = new FBXLoader();
//     const objects = [];

//     Array.from(files).forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         const result = event.target.result;
//         const arrayBuffer = result;

//         if (db) {
//           await db.put("files", { id: file.name, data: arrayBuffer });
//           // console.log(Stored file: ${file.name});
//           console.log(`Stored file: ${file.name}`);
//           loadModelsFromDB(db);
//         }
//       };
//       reader.readAsArrayBuffer(file);
//     });
//   };

//   const loadModelsFromDB = async (database) => {
//     const loader = new FBXLoader();
//     const tx = database.transaction("files", "readonly");
//     const store = tx.objectStore("files");
//     const allFiles = await store.getAll();
//     const objects = [];

//     for (const file of allFiles) {
//       const arrayBuffer = file.data;

//       loader.load(
//         URL.createObjectURL(new Blob([arrayBuffer])),
//         (object) => {
//           object.traverse((child) => {
//             if (child.isMesh && child.material) {
//               child.material = new THREE.MeshStandardMaterial({
//                 color: child.material.color,
//                 map: child.material.map,
//               });
//             }
//           });

//           objects.push(object);
//           const boundingBox = new THREE.Box3().setFromObject(object);
//           cumulativeBoundingBox.current.union(boundingBox);
//           sceneRef.current.add(object);

//           setBoundingBoxes((prev) => {
//             const updatedBoundingBoxes = [...prev, boundingBox];
//             createBoundingBoxCubes(updatedBoundingBoxes); // Call function to create cubes
//             return updatedBoundingBoxes;
//           });

//           adjustCamera();
//         },
//         undefined,
//         (error) => {
//           console.error("Error loading model:", error);
//         }
//       );
//     }
//   };

//   const createBoundingBoxCubes = (updatedBoundingBoxes) => {
//     updatedBoundingBoxes.forEach((boundingBox) => {
//       const helper = new THREE.Box3Helper(boundingBox, 0x00ff00);
//       sceneRef.current.add(helper);
//     });
//   };

//   const adjustCamera = () => {
//     const center = new THREE.Vector3();
//     cumulativeBoundingBox.current.getCenter(center);
//     const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
//     const distance = size.length();
//     const fov = cameraRef.current.fov * (Math.PI / 180);
//     let cameraZ = distance / (2 * Math.tan(fov / 2));
//     cameraZ *= 2.5;

//     cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
//     cameraRef.current.lookAt(center);
//     controlsRef.current.target.copy(center);
//     controlsRef.current.update();
//   };

//   const onFileChange = (event) => {
//     cumulativeBoundingBox.current = new THREE.Box3(
//       new THREE.Vector3(Infinity, Infinity, Infinity),
//       new THREE.Vector3(-Infinity, -Infinity, -Infinity)
//     );
//     setBoundingBoxes([]); // Reset bounding boxes state
//     loadModels(event.target.files);
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     if (isVisible) {
//       controlsRef.current.update();
//       rendererRef.current.render(sceneRef.current, cameraRef.current);
//     }
//   };

//   const toggleVisibility = (visible) => {
//     setIsVisible(visible);
//     sceneRef.current.traverse(function (object) {
//       if (object instanceof THREE.Mesh) {
//         object.visible = visible;
//       }
//     });
//   };

//   const resetCameraView = () => {
//     const center = new THREE.Vector3();
//     cumulativeBoundingBox.current.getCenter(center);
//     const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
//     const distance = size.length();
//     const fov = cameraRef.current.fov * (Math.PI / 180);
//     let cameraZ = distance / (2 * Math.tan(fov / 2));
//     cameraZ *= 2.5;

//     cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
//     cameraRef.current.lookAt(center);
//     controlsRef.current.target.copy(center);
//     controlsRef.current.update();
//   };

//   return (
//     <div className="main">
//       <div className="canvas-container">
//         <input
//           className="button"
//           type="file"
//           multiple
//           onChange={onFileChange}
//           accept=".fbx"
//         />
//         <div ref={mountRef} style={{ width: "99%", height: "100vh" }}></div>
//       </div>
//       <div className="button-container">
//         <button
//           className="custom-button hide-show"
//           onClick={() => toggleVisibility(true)}
//         >
//           <FontAwesomeIcon icon={faEye} />
//         </button>
//         <button
//           className="custom-button"
//           onClick={() => toggleVisibility(false)}
//         >
//           <FontAwesomeIcon icon={faEyeSlash} />
//         </button>
//         <button className="custom-button fit-view" onClick={resetCameraView}>
//           <FontAwesomeIcon icon={faSearch} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default FBXViewer;







import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { openDB } from "idb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function FBXViewer() {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const controlsRef = useRef(null);
  const cumulativeBoundingBox = useRef(
    new THREE.Box3(
      new THREE.Vector3(Infinity, Infinity, Infinity),
      new THREE.Vector3(-Infinity, -Infinity, -Infinity)
    )
  );
  const [isVisible, setIsVisible] = useState(true);
  const [db, setDb] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState([]); // State to store bounding boxes
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    const initDB = async () => {
      const database = await openDB("fbx-files-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", {
              keyPath: "id",
              autoIncrement: true,
            });
          }
        },
      });
      await clearDatabase(database);
      setDb(database);
      await loadModelsFromDB(database);
    };

    initDB();

    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0xd3d3d3);
    rendererRef.current.gammaOutput = true;
    rendererRef.current.gammaFactor = 2.2;
    mountRef.current.appendChild(rendererRef.current.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    sceneRef.current.add(directionalLight);
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.1;

    animate();

    return () => {
      mountRef.current.removeChild(rendererRef.current.domElement);
      controlsRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    // Log the boundingBoxes state whenever it changes
    console.log("Bounding Boxes:", boundingBoxes);
  }, [boundingBoxes]);

  const clearDatabase = async (database) => {
    const tx = database.transaction("files", "readwrite");
    const store = tx.objectStore("files");
    await store.clear();
    await tx.done;
  };

  const loadModels = async (files) => {
    const loader = new FBXLoader();

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target.result;
        const arrayBuffer = result;

        if (db) {
          await db.put("files", { id: file.name, data: arrayBuffer });
          console.log(`Stored file: ${file.name}`);
          loadModelsFromDB(db);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const loadModelsFromDB = async (database) => {
    const loader = new FBXLoader();
    const tx = database.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const allFiles = await store.getAll();
    const objects = [];

    for (const file of allFiles) {
      const arrayBuffer = file.data;

      loader.load(
        URL.createObjectURL(new Blob([arrayBuffer])),
        (object) => {
          object.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: child.material.color,
                map: child.material.map,
              });
            }
          });

          objects.push(object);
          const boundingBox = new THREE.Box3().setFromObject(object);
          cumulativeBoundingBox.current.union(boundingBox);
          sceneRef.current.add(object);

          setBoundingBoxes((prev) => {
            const updatedBoundingBoxes = [...prev, boundingBox];
            createBoundingBoxCubes(updatedBoundingBoxes); // Call function to create cubes
            return updatedBoundingBoxes;
          });

          adjustCamera();
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );
    }
  };

  const createBoundingBoxCubes = (updatedBoundingBoxes) => {
    updatedBoundingBoxes.forEach((boundingBox) => {
      const helper = new THREE.Box3Helper(boundingBox, 0x00ff00);
      sceneRef.current.add(helper);
    });
  };

  const adjustCamera = () => {
    const center = new THREE.Vector3();
    cumulativeBoundingBox.current.getCenter(center);
    const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
    const distance = size.length();
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = distance / (2 * Math.tan(fov / 2));
    cameraZ *= 2.5;

    cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  const onFileChange = (event) => {
    cumulativeBoundingBox.current = new THREE.Box3(
      new THREE.Vector3(Infinity, Infinity, Infinity),
      new THREE.Vector3(-Infinity, -Infinity, -Infinity)
    );
    setBoundingBoxes([]); // Reset bounding boxes state
    loadModels(event.target.files);
  };

  const performRaycasting = () => {
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    const intersects = raycasterRef.current.intersectObjects(
      sceneRef.current.children,
      true
    );

    if (intersects.length > 0) {
      const firstIntersectedObject = intersects[0].object;
      console.log("Hitted:",intersects || firstIntersectedObject.name || firstIntersectedObject.uuid);
    } 
  };
  performRaycasting()

  const animate = () => {
    requestAnimationFrame(animate);
    if (isVisible) {
      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      // performRaycasting();
    }
  };

  const toggleVisibility = (visible) => {
    setIsVisible(visible);
    sceneRef.current.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.visible = visible;
      }
    });
  };

  const resetCameraView = () => {
    const center = new THREE.Vector3();
    cumulativeBoundingBox.current.getCenter(center);
    const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
    const distance = size.length();
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = distance / (2 * Math.tan(fov / 2));
    cameraZ *= 2.5;

    cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  return (
    <div className="main">
      <div className="canvas-container">
        <input
          className="button"
          type="file"
          multiple
          onChange={onFileChange}
          accept=".fbx"
        />
        <div ref={mountRef} style={{ width: "99%", height: "100vh" }}></div>
      </div>
      <div className="button-container">
        <button
          className="custom-button hide-show"
          onClick={() => toggleVisibility(true)}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
        <button
          className="custom-button"
          onClick={() => toggleVisibility(false)}
        >
          <FontAwesomeIcon icon={faEyeSlash} />
        </button>
        <button className="custom-button fit-view" onClick={resetCameraView}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
}

export default FBXViewer;
