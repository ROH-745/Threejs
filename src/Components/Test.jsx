

// WORKING(MAIN) ADDED FRUSTUM CULLING

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { openDB } from "idb";
import "./App.css";

function FBXViewer() {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const controlsRef = useRef(null);
  const [db, setDb] = useState(null);
  const cumulativeBoundingBoxRef = useRef(new THREE.Box3());
  const cumulativeBoundingBoxHelperRef = useRef(null);
  const loadedMeshesRef = useRef([]);
  const frustumRef = useRef(new THREE.Frustum());
  const frustumMatrixRef = useRef(new THREE.Matrix4());

  useEffect(() => {
    const initDB = async () => {
      const database = await openDB("fbx-files-db", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
          }
        },
      });
      setDb(database);
    };

    initDB();

    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(rendererRef.current.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    sceneRef.current.add(directionalLight);

    controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.1;

    animate();

    return () => {
      mountRef.current.removeChild(rendererRef.current.domElement);
      controlsRef.current.dispose();
    };
  }, []);

  const loadModel = async (file) => {
    const loader = new FBXLoader();
    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      if (db) {
        await db.put("files", { id: file.name, data: arrayBuffer });
        console.log(`Stored file: ${file.name}`);
        loadModelFromDB(db, file.name);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const loadModelFromDB = async (database, fileName) => {
    const loader = new FBXLoader();
    const tx = database.transaction("files", "readonly");
    const store = tx.objectStore("files");
    const file = await store.get(fileName);

    if (file) {
      const arrayBuffer = file.data;

      loader.load(
        URL.createObjectURL(new Blob([arrayBuffer])),
        (object) => {
          object.traverse((child) => {
            if (child.isMesh) {
              loadedMeshesRef.current.push(child);
            }
          });
          sceneRef.current.add(object);
          createBoundingBox(object);
          updateCumulativeBoundingBox();
          adjustCamera();
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );
    }
  };

  const createBoundingBox = (object) => {
    const box = new THREE.Box3().setFromObject(object);
    // const helper = new THREE.Box3Helper(box, 0xffff00);
    // sceneRef.current.add(helper);
  };

  const updateCumulativeBoundingBox = () => {
    cumulativeBoundingBoxRef.current.makeEmpty();
    loadedMeshesRef.current.forEach((mesh) => {
      cumulativeBoundingBoxRef.current.expandByObject(mesh);
    });

    if (cumulativeBoundingBoxHelperRef.current) {
      sceneRef.current.remove(cumulativeBoundingBoxHelperRef.current);
    }

    cumulativeBoundingBoxHelperRef.current = new THREE.Box3Helper(cumulativeBoundingBoxRef.current, 0xff0000);
    sceneRef.current.add(cumulativeBoundingBoxHelperRef.current);
  };

  const adjustCamera = () => {
    const box = cumulativeBoundingBoxRef.current;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5; // Zoom out a little so object fits in view

    cameraRef.current.position.set(center.x, center.y, center.z + cameraZ);
    cameraRef.current.lookAt(center);
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  };

  const updateVisibleMeshes = () => {
    frustumMatrixRef.current.multiplyMatrices(cameraRef.current.projectionMatrix, cameraRef.current.matrixWorldInverse);
    frustumRef.current.setFromProjectionMatrix(frustumMatrixRef.current);

    loadedMeshesRef.current.forEach((mesh) => {
      if (frustumRef.current.intersectsObject(mesh)) {
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  
    
  };


  


  const onFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        loadModel(file);
      });
    }
  };
  

  const animate = () => {
    requestAnimationFrame(animate);
    controlsRef.current.update();
    updateVisibleMeshes();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  return (
    <div className="main">
      <div className="canvas-container">
        <input className="button" type="file" multiple onChange={onFileChange} accept=".fbx" />
        <div ref={mountRef} style={{ width: "100%", height: "100vh" }}></div>
      </div>
    </div>
  );
}

export default FBXViewer;