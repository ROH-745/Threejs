import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./App.css";
// import myImg from '\vite.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';


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

  const [isVisible, setIsVisible] = useState(true);  // State to control visibility 

  useEffect(() => {
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setClearColor(0xd3d3d3); // Light grey background color
    rendererRef.current.gammaOutput = true; // Ensure correct color management
    rendererRef.current.gammaFactor = 2.2; // Good default gamma factor
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Add lighting
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

  const loadModels = (files) => {
    const loader = new FBXLoader();
    let loadedCount = 0;
    const totalFiles = files.length;
    const objects = [];

    Array.from(files).forEach((file) => {
      loader.load(
        URL.createObjectURL(file),
        (object) => {
          // Adjust materials to ensure they react to light
          object.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material = new THREE.MeshStandardMaterial({
                color: child.material.color,
                map: child.material.map, // Keep the texture if any
              });
            }
          });

          objects.push(object);
          const boundingBox = new THREE.Box3().setFromObject(object);
          cumulativeBoundingBox.current.union(boundingBox);
          loadedCount++;

          if (loadedCount === totalFiles) {
            // All files have been loaded, add them to the scene
            objects.forEach((obj) => sceneRef.current.add(obj));
            adjustCamera(); // Adjust the camera once after all models have been loaded
          }
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );
    });
  };

  const adjustCamera = () => {
    const center = new THREE.Vector3();
    cumulativeBoundingBox.current.getCenter(center);
    const size = cumulativeBoundingBox.current.getSize(new THREE.Vector3());
    const distance = size.length();
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = distance / (2 * Math.tan(fov / 2));
    cameraZ *= 2.5; // Adjust multiplier to ensure all models are visible

    cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  const onFileChange = (event) => {
    // Reset cumulative bounding box for new set of files
    cumulativeBoundingBox.current = new THREE.Box3(
      new THREE.Vector3(Infinity, Infinity, Infinity),
      new THREE.Vector3(-Infinity, -Infinity, -Infinity)
    );
    loadModels(event.target.files);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    if (isVisible) {  // Only update controls and render if visible
        controlsRef.current.update();
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
};

  // const toggleVisibility = () => {
  //   setIsVisible(!isVisible);  // Toggle the visibility state
  //   sceneRef.current.traverse(function (object) {  // Apply visibility change to all objects in the scene
  //       if (object instanceof THREE.Mesh) {
  //           object.visible = !isVisible;
  //       }
  //   });
  // };

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
    cameraZ *= 2.5;  // Adjust to ensure all models are visible

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
        <button className="custom-button hide-show" onClick={() => toggleVisibility(true)}>
          <FontAwesomeIcon icon={faEye}  />
          </button>
          <button className="custom-button"   onClick={() => toggleVisibility(false)}>
          <FontAwesomeIcon icon={faEyeSlash} />
          </button>
       
          
          
            
        
        <button className="custom-button fit-view" onClick={resetCameraView}>
        <FontAwesomeIcon icon={faSearch}  />
          
        </button>
    </div>
</div>

  );
}

export default FBXViewer;
