// import "./styles.css";
// import * as THREE from "three";

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { 
//   colors, 
//   groundMaterial,
//   wallMaterial
// } from "./materials.ts";

// import {
//   awning,
//   retractableAwning,
//   balcony,
//   balconydoor,
//   wallRailing,
//   shuttersWithFrame,
//   plant,
//   hangingLights,
//   bulbLight,
//   chair,
//   table,
// } from "./shapes/shapes";

// import {
//   Evaluator,
//   EdgesHelper,
//   Operation,
//   OperationGroup,
//   ADDITION,
//   SUBTRACTION,
// } from "three-bvh-csg";

// import Stats from "stats.js";
// import dayLight from "./daylight";


// import init, { IHouseFloor, IHouseSide } from "./house";
// import spanishHouse from "./houses/spanish";

// const stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

// // init house
// const house = init(spanishHouse);

// const settings = {
//     isNight: true,
// };

// let scene = new THREE.Scene();
// if (settings.isNight) {
//   colors.background = 0x000000;
// }
// scene.background = new THREE.Color(colors.background);


// const isocamera = false;

// let camera;
// let cameraSettings = {
//   position: new THREE.Vector3(),
//   lookAt: new THREE.Vector3(),
//   fov: 45,
//   far: 250,
// };

// if (isocamera) {
//   const aspect = window.innerWidth / window.innerHeight;
//   const d = 20;
//   camera = new THREE.OrthographicCamera(
//     -d * aspect,
//     d * aspect,
//     d,
//     -d,
//     1,
//     4000
//   );

//   camera.position.set(20, 20, 20);
//   camera.rotation.order = "YXZ";
//   camera.rotation.y = -Math.PI / 4;
//   camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
// } else {
//   let cameraPositionFront = {
//     fov: 15,
//     far: 250,
//     position: new THREE.Vector3(0, 7, 60),
//     lookAt: new THREE.Vector3(0, 5, 0),
//   };
//   let cameraPositionAngled = {
//     fov: 45,
//     far: 250,
//     position: new THREE.Vector3(15, 15, 20),
//     lookAt: new THREE.Vector3(0, 5, 0),
//   };
//   let cameraPositionISO = {
//     fov: 15,
//     far: 250,
//     position: new THREE.Vector3(50, 20, 50),
//     lookAt: new THREE.Vector3(0, 5, 0),
//   };
//   cameraSettings = cameraPositionAngled;
//   camera = new THREE.PerspectiveCamera(
//     cameraSettings.fov,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     cameraSettings.far
//   );
//   camera.position.copy(cameraSettings.position);
// }

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.physicallyCorrectLights = true;
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.CineonToneMapping;

// // progressive lightmap
// document.body.appendChild(renderer.domElement);

// //deferred rendering,
// renderer.toneMappingExposure = 1.75;
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// window.addEventListener("resize", (event) => {
//   // camera.aspect = window.innerWidth / window.innerHeight;
//   // camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });


// let hour = 23;
// const lights = dayLight();
// lights.render(scene);
// function updatetime() {
//   lights.setTime({ hour: hour });
//   hour = hour >= 23 ? (hour = 0) : hour + 1;

//   //setTimeout(updatetime, 300);
//   renderer.render(scene, camera);
// }
// updatetime();

// let controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.enablePan = true;
// controls.target = cameraSettings.lookAt;

// if (hour >= 22 || hour < 6) {
//   // console.log("testbulb", testbulb);
//   scene.add(bulbLight(-1, 9, -1));
//   scene.add(bulbLight(-1, 2, -1));

//   const chairmodel = chair(-2, 0, 3, 0);
//   scene.add(chairmodel);

//   const chairmodel2 = chairmodel.clone();
//   chairmodel2.position.set(-2.1, 0, 3.8);
//   chairmodel2.rotation.y = THREE.MathUtils.degToRad(20);
//   scene.add(chairmodel2);

//   const tablemodel = table(-1, 0, 3.5, -5);
//   scene.add(tablemodel);
//   // const sphereSize = 0.1;
//   // const pointLightHelper = new THREE.PointLightHelper(testbulb, sphereSize);
//   // scene.add(pointLightHelper);
// }

// // CSG
// let csgEvaluator, result;
// csgEvaluator = new Evaluator();
// csgEvaluator.attributes = ["position", "normal"];
// csgEvaluator.useGroups = false;
// csgEvaluator.debug.enabled = true;

// function renderOutput(outputGroup) {
//   if (result && result.geometry) {
//     //result.geometry.dispose();
//     //result.parent.remove(result);
//   }

//   result = csgEvaluator.evaluateHierarchy(outputGroup);
//   result.material = wallMaterial;
//   result.castShadow = true;
//   result.receiveShadow = true;

//   result.matrixAutoUpdate = false;
//   result.updateMatrix();
//   scene.add(result);

// }

// const houseGroup = new Operation(new THREE.BoxGeometry(0.01, 0.01, 0.01)); //BoxBufferGeometry
// houseGroup.operation = ADDITION;
// houseGroup.receiveShadow = true;

// function isWithin(center, point, dist) {
//   if (point.distanceTo(center) < dist) {
//     return true;
//   }
//   if (point.distanceTo(center) < dist + 200 && Math.random() > 0.3) {
//     return true;
//   }
//   if (point.distanceTo(center) < dist + 400 && Math.random() > 0.7) {
//     return true;
//   }
//   return false;
// }

// function addRealFloor(floor) {
//   if (floor.sides.length > 0) {
//     const shape = new THREE.Shape();
//     if (floor.sides[0].end && floor.sides[0].start) {
//       shape.moveTo(floor.sides[0].end.x, floor.sides[0].end.z);
//       for (var i = 1; i < floor.sides.length; i++) {
//         if (floor.sides[i].end && floor.sides[i].end.x !== null) {
//           shape.lineTo(floor.sides[i].end.x, floor.sides[i].end.z);
//         }
//       }
//       shape.closePath();

//       const extrudeSettings = {
//         steps: 1,
//         depth: 0.02,
//         bevelEnabled: false,
//       };
//       const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//       geometry.rotateX(Math.PI / 2);
//       geometry.scale(0.99, 1, 0.99);
//       const mesh = new THREE.Mesh(geometry, floor.materials.floor); //, floor.materials.default
//       mesh.position.y = floor.sides[0].start.y + 0.01;
//       mesh.castShadow = true;
//       mesh.receiveShadow = true;
//       scene.add(mesh);
//     }
//   }
// }


// function addFloor(floor) {
//   if (floor.floor === true) {
//     addRealFloor(floor);
//   }

//   const floorGroup = new OperationGroup();

//   const dummy = new Operation(new THREE.BoxGeometry(1, 1, 1));

//   let s = 0;
//   floor.sides.forEach((side) => {
//     const wallWidth = side.width || 0.01;

//     const floorSideGroup = new OperationGroup();
//     floorSideGroup.position.x = side.start?.x;
//     floorSideGroup.position.z = side.start?.z;
//     floorSideGroup.position.y = side.start?.y;

//     const shapesGroup = new THREE.Group();
//     shapesGroup.position.set(
//       floorSideGroup.position.x,
//       floorSideGroup.position.y,
//       floorSideGroup.position.z
//     );

//     const wallGeo = new THREE.BoxGeometry(
//       wallWidth,
//       floor.height,
//       house.wallthickness
//     );
//     wallGeo.translate(wallWidth / 2, 0, -house.wallthickness / 2);
//     const wall = new Operation(wallGeo); //BoxBufferGeometry
//     wall.operation = ADDITION;
//     wall.receiveShadow = true;
//     wall.position.y = floor.height / 2;
//     wall.position.x = 0;
//     wall.position.z = 0;
//     floorSideGroup.add(wall);

//     addFloorHoles(shapesGroup, floorSideGroup, side);
//     floorGroup.add(floorSideGroup);

//     if (s < floor.sides.length - 1) {
//       dummy.position.copy(side.end);
//       dummy.lookAt(side.start);
//       floorSideGroup.rotation.y = dummy.rotation.y + Math.PI / 2;
//     } else {
//       dummy.position.copy(side.start);
//       dummy.lookAt(side.end);
//       floorSideGroup.rotation.y = dummy.rotation.y - Math.PI / 2;
//     }

//     shapesGroup.rotation.y = floorSideGroup.rotation.y;
//     scene.add(shapesGroup);

//     s++;
//   });
//   return floorGroup;
// }


// const groundPlane = new THREE.Mesh(
//   new THREE.CylinderGeometry(30, 30, 1, 32),
//   groundMaterial
// );
// groundPlane.position.y = -0.5;
// groundPlane.castShadow = true;
// groundPlane.receiveShadow = true;
// scene.add(groundPlane);

// // renderOutput(houseGroup);

// function animate() {
//   stats.begin();
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
//   lights.setAutoUpdate(false);
//   stats.end();
// }
// animate();
// controls.update();