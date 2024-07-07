import "./styles.css";
import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { FatLinesBatch } from "./js/FatLinesBatch";
// import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

//console.clear();

import spanishHouse from "./houses/spanish";
import init, { IHouseFloor, IHouseSide, IRoof } from "./house";
import {
  awning,
  retractableAwning,
  balcony,
  balconydoor,
  wallRailing,
  shuttersWithFrame,
  plant,
  hangingLights,
  bulbLight,
  chair,
  table,
} from "./shapes/shapes";

import {
  windowMaterial,
  wallMaterial,
  pavementMaterial,
  colors,
  groundMaterial,
  backgroundMaterial,
  floorMaterial,
} from "./materials";

import dayLight from "./daylight";

import { PencilLinesPass } from "./js/pencil-effect/PencilLinesPass";
// import { WebGLCanvasMasker } from "./js/fast-lines/WebGLCanvasMasker";

import {
  Evaluator,
  EdgesHelper,
  Operation,
  OperationGroup,
  ADDITION,
  SUBTRACTION,
} from "three-bvh-csg";

import Stats from "stats.js";

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const house = init(spanishHouse);
const settings = {
  isNight: true,
};

let scene = new THREE.Scene();
if (settings.isNight) {
  colors.background = 0x000000;
}
scene.background = new THREE.Color(colors.background);


const isocamera = false;

let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
let cameraSettings = {
  position: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
  fov: 45,
  far: 250,
};

if (isocamera) {
  const aspect = window.innerWidth / window.innerHeight;
  const d = 20;
  camera = new THREE.OrthographicCamera(
    -d * aspect,
    d * aspect,
    d,
    -d,
    1,
    4000
  );

  camera.position.set(20, 20, 20);
  camera.rotation.order = "YXZ";
  camera.rotation.y = -Math.PI / 4;
  camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
} else {
  let cameraPositionFront = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(0, 7, 60),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  let cameraPositionAngled = {
    fov: 45,
    far: 250,
    position: new THREE.Vector3(15, 15, 20),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  let cameraPositionISO = {
    fov: 15,
    far: 250,
    position: new THREE.Vector3(50, 20, 50),
    lookAt: new THREE.Vector3(0, 5, 0),
  };
  cameraSettings = cameraPositionAngled;
  camera = new THREE.PerspectiveCamera(
    cameraSettings.fov,
    window.innerWidth / window.innerHeight,
    0.1,
    cameraSettings.far
  );
  camera.position.copy(cameraSettings.position);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor("#eee");
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.CineonToneMapping;

//deferred rendering,
renderer.toneMappingExposure = 1.75;
// renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.needsUpdate = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// progressive lightmap

document.body.appendChild(renderer.domElement);

// {
//   const color = colors.background; // white
//   const near = 20;
//   const far = 50;
//   scene.fog = new THREE.Fog(color, near, far);
// }
window.addEventListener("resize", (event) => {
  //camera.aspect = window.innerWidth / window.innerHeight;
  //camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let hour = 23;
const lights = dayLight();
lights.render(scene);
function updatetime() {
  lights.setTime({ hour: hour });
  hour = hour >= 23 ? (hour = 0) : hour + 1;

  //setTimeout(updatetime, 300);
  renderer.render(scene, camera);
}
updatetime();

//scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));

// const wallLight = new THREE.SpotLight(0xffcf73, 1);

// wallLight.power = 50;
// wallLight.decay = 0.7;
// wallLight.position.set(330, 250, -100);
// wallLight.target.position.set(330, 0, -100);
// wallLight.target.updateMatrixWorld();
// scene.add(wallLight);

// const wallLightHelper = new THREE.SpotLightHelper(wallLight, 10);
// scene.add(wallLightHelper);

// const plane2 = new THREE.Mesh(
//   new THREE.CylinderGeometry(1, 1, 0.1, 32),
//   groundMaterial
// );
// plane2.position.set(0, 1, 5);
// plane2.receiveShadow = true;
// plane2.castShadow = true;
// scene.add(plane2);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.target = cameraSettings.lookAt;

// const axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);

if (hour >= 22 || hour < 6) {
  // console.log("testbulb", testbulb);
  scene.add(bulbLight(-1, 9, -1));
  scene.add(bulbLight(-1, 2, -1));

  const chairmodel = chair(-2, 0, 3, 0);
  scene.add(chairmodel);

  const chairmodel2 = chairmodel.clone();
  chairmodel2.position.set(-2.1, 0, 3.8);
  chairmodel2.rotation.y = THREE.MathUtils.degToRad(20);
  scene.add(chairmodel2);

  const tablemodel = table(-1, 0, 3.5, -5);
  scene.add(tablemodel);
  // const sphereSize = 0.1;
  // const pointLightHelper = new THREE.PointLightHelper(testbulb, sphereSize);
  // scene.add(pointLightHelper);
}
// CSG
let csgEvaluator: any, result: any;
csgEvaluator = new Evaluator();
csgEvaluator.attributes = ["position", "normal"];
csgEvaluator.useGroups = false;
csgEvaluator.debug.enabled = true;

function renderOutput(outputGroup: any) {
  if (result && result.geometry) {
    //result.geometry.dispose();
    //result.parent.remove(result);
  }

  result = csgEvaluator.evaluateHierarchy(outputGroup);
  result.material = wallMaterial;
  result.castShadow = true;
  result.receiveShadow = true;

  result.matrixAutoUpdate = false;
  result.updateMatrix();
  scene.add(result);

  // console.log(result.intersectionEdges);
}

const houseGroup = new Operation(new THREE.BoxGeometry(0.01, 0.01, 0.01)); //BoxBufferGeometry
houseGroup.operation = ADDITION;
houseGroup.receiveShadow = true;

function addFloorHoles(
  shapesgroup: any,
  floorSideGroup: any,
  side: IHouseSide
) {
  if (side.holes) {
    side.holes.forEach((hole) => {
      if (hole && hole.shapes) {
        let generatedShape: {
          shape?: any;
          hole?: any;
        };
        for (const shape of hole.shapes) {
          generatedShape = {};
          switch (shape.type) {
            case "shuttersWithFrame":
              generatedShape = shuttersWithFrame({
                settings: shape,
                hole: hole,
              });
              break;
            case "awning":
              generatedShape = awning({
                settings: shape,
                hole: hole,
              });
              break;
            case "retractable-awning":
              generatedShape = retractableAwning({
                settings: { ...shape },
                hole: hole,
              });
              break;
            case "balconydoor":
              generatedShape = balconydoor({ settings: shape, hole: hole });
              break;
            case "balcony":
              generatedShape = balcony({
                settings: shape,
                hole: hole,
              });
              break;
            case "wallRailing":
              generatedShape = wallRailing({
                settings: shape,
                hole: hole,
              });
              break;
            case "plant":
              generatedShape = plant({
                settings: shape,
                hole: hole,
              });
              break;
            case "hangingLights":
              generatedShape = hangingLights({
                settings: shape,
                hole: hole,
              });
              break;
          }
          if (generatedShape && generatedShape.shape) {
            shapesgroup.add(generatedShape.shape);
          }
          if (generatedShape && generatedShape.hole) {
            generatedShape.hole.receiveShadow = true;
            // generatedShape.hole.operation = ADDITION;
            floorSideGroup.add(generatedShape.hole);
          }
        }
      }
    });
  }
}

function isWithin(center: THREE.Vector3, point: THREE.Vector3, dist: number) {
  if (point.distanceTo(center) < dist) {
    return true;
  }
  if (point.distanceTo(center) < dist + 200 && Math.random() > 0.3) {
    return true;
  }
  if (point.distanceTo(center) < dist + 400 && Math.random() > 0.7) {
    return true;
  }
  return false;
}

function addPavement() {
  const center = new THREE.Vector3(0, 0, 0); // Your point
  const g = new THREE.Group();
  g.position.y = -0.1;
  const gridSize = 40;
  const gap = 0.1;
  let width = 0.8;
  const maskRadius = 5;

  const shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.lineTo(0, width);
  shape.lineTo(width, width);
  shape.lineTo(width, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 1,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(Math.PI / 2);
  const plate = new THREE.Mesh(geometry, pavementMaterial);

  let x = 0;
  let z = -(gridSize * (width + gap)) / 2;

  for (var i = 0; i < gridSize; i++) {
    x = -(gridSize * (width + gap)) / 2;
    for (var ii = 0; ii < gridSize; ii++) {
      if (isWithin(center, new THREE.Vector3(x, 0, z), maskRadius)) {
        const plateclone = plate.clone();
        plateclone.position.x = x;
        plateclone.position.z = z;
        plateclone.castShadow = true;
        plateclone.receiveShadow = true;
        g.add(plateclone);
      }

      x += width + gap;
    }
    z += width + gap;
  }

  scene.add(g);

  // const plane = new THREE.Mesh(
  //   // new THREE.PlaneGeometry(5000, 5000),
  //   new THREE.CylinderGeometry(
  //     maskRadius + 50 / 2,
  //     maskRadius + 50 / 2,
  //     10,
  //     32
  //   ),
  //   groundMaterial
  // );
  // plane.position.y = -10;
  // plane.receiveShadow = true;
  // scene.add(plane);
}

function addRealFloor(floor: IHouseFloor) {
  if (floor.sides.length > 0) {
    const shape = new THREE.Shape();
    if (floor.sides[0].end && floor.sides[0].start) {
      shape.moveTo(floor.sides[0].end.x, floor.sides[0].end.z);
      for (var i = 1; i < floor.sides.length; i++) {
        if (floor.sides[i].end && floor.sides[i].end.x !== null) {
          shape.lineTo(floor.sides[i].end.x, floor.sides[i].end.z);
        }
      }
      shape.closePath();

      const extrudeSettings = {
        steps: 1,
        depth: 0.02,
        bevelEnabled: false,
      };
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.rotateX(Math.PI / 2);
      geometry.scale(0.99, 1, 0.99);
      const mesh = new THREE.Mesh(geometry, floor.materials.floor); //, floor.materials.default
      mesh.position.y = floor.sides[0].start.y + 0.01;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    }
  }
}

function addFloor(floor: IHouseFloor) {
  if (floor.floor === true) {
    addRealFloor(floor);
  }

  const floorGroup = new OperationGroup();

  const dummy = new Operation(new THREE.BoxGeometry(1, 1, 1));

  let s = 0;
  floor.sides.forEach((side) => {
    const wallWidth = side.width || 0.01;

    const floorSideGroup = new OperationGroup();
    floorSideGroup.position.x = side.start?.x;
    floorSideGroup.position.z = side.start?.z;
    floorSideGroup.position.y = side.start?.y;

    const shapesGroup = new THREE.Group();
    shapesGroup.position.set(
      floorSideGroup.position.x,
      floorSideGroup.position.y,
      floorSideGroup.position.z
    );
    // shapesGroup.add(dummy);
    // const sphere = new Operation(
    //   new THREE.SphereGeometry(30 * count, 30 * count, 30 * count)
    // );
    // shapesGroup.add(sphere);

    const wallGeo = new THREE.BoxGeometry(
      wallWidth,
      floor.height,
      house.wallthickness
    );
    wallGeo.translate(wallWidth / 2, 0, -house.wallthickness / 2);
    const wall = new Operation(wallGeo); //BoxBufferGeometry
    wall.operation = ADDITION;
    wall.receiveShadow = true;
    wall.position.y = floor.height / 2;
    wall.position.x = 0;
    wall.position.z = 0;
    // floorSideGroup.rotation.y = Math.PI / 2;
    floorSideGroup.add(wall);

    addFloorHoles(shapesGroup, floorSideGroup, side);
    floorGroup.add(floorSideGroup);
    //floorSideGroup.rotation.y = Math.PI / -2;

    if (s < floor.sides.length - 1) {
      dummy.position.copy(side.end);
      dummy.lookAt(side.start);
      floorSideGroup.rotation.y = dummy.rotation.y + Math.PI / 2;
    } else {
      dummy.position.copy(side.start);
      dummy.lookAt(side.end);
      floorSideGroup.rotation.y = dummy.rotation.y - Math.PI / 2;
    }

    shapesGroup.rotation.y = floorSideGroup.rotation.y;
    scene.add(shapesGroup);

    s++;
  });

  // dummy.parent.remove(dummy);
  //floorGroup.add(wall);

  houseGroup.add(floorGroup);
  return floorGroup;
  //renderOutput(wall, wallMaterial);
}

function addRoof(roof): THREE.Group {
  const roofGroup = new THREE.Group();

  // Assuming a flat roof for simplicity. Adjust geometry for different roof types.
  const roofGeometry = new THREE.BoxGeometry(roof.width, roof.height, roof.depth);
  const roofMesh = new THREE.Mesh(roofGeometry, roof.material);

  // Adjust position based on the provided parameters
  roofMesh.position.set(roof.position.x, roof.position.y, roof.position.z);
  roofMesh.receiveShadow = true;

  roofGroup.add(roofMesh);

  houseGroup.add(roofGroup); // Assuming houseGroup is accessible in this context

  return roofGroup;
}

//addPavement();

const groundPlane = new THREE.Mesh(
  new THREE.CylinderGeometry(30, 30, 1, 32),
  groundMaterial
);

groundPlane.position.y = -0.5;
groundPlane.castShadow = true;
groundPlane.receiveShadow = true;
scene.add(groundPlane);

for (const floor of house.floors) {
  houseGroup.add(addFloor(floor));
}

houseGroup.add(addRoof(house.roof));

renderOutput(houseGroup);

// renderer.setAnimationLoop((_) => {
//   // let t = clock.getElapsedTime();
//   // controls.update();
//   renderer.render(scene, camera);
// });

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  // setTimeout(animate, 200);

  //edgesHelper.setEdges(csgEvaluator.debug.intersectionEdges);
  //edgesHelper.visible = true;

  renderer.render(scene, camera);
  // renderer.shadowMap.needsUpdate = false;
  lights.setAutoUpdate(false);
  stats.end();
}
animate();
controls.update();

//controls.addEventListener("change", animate);
