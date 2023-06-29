import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

window.addEventListener("load", init);

function init() {
  // シーンの追加
  const scene = new THREE.Scene();

  // カメラの追加
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  // レンダラーの追加
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  // サイズ調整
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 画質調整
  renderer.setPixelRatio(window.devicePixelRatio);
  // レンダリングしたいDOM要素と紐付け
  document.body.appendChild(renderer.domElement);

  // ジオメトリ作成
  const sphereGeometry = new THREE.SphereGeometry();
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const octahedronGeometry = new THREE.OctahedronGeometry(1);

  // マテリアル作成
  // const material = new THREE.MeshBasicMaterial({
  //   color: "#cecece",
  //   wireframe: true,
  // });
  const material = new THREE.MeshPhongMaterial({
    color: "#ede5ff",
    emissive: "#361249",
    speculay: "#ffadad",
    shininess: 100,
    flatShading: true,
    fog: true,
    envMaps: "reflection",
    reflectivity: 1,
    refractionRatio: 1,
  });

  material.side = THREE.DoubleSide;

  // 光源
  const ambientLight = new THREE.AmbientLight("#ffffff", 0.7);
  const pointLight = new THREE.PointLight("#ffffff", 1);
  pointLight.position.set(1, 2, 3);
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  scene.add(ambientLight, pointLight, pointLightHelper);

  // メッシュ化
  const sphere = new THREE.Mesh(sphereGeometry, material);
  const plane = new THREE.Mesh(planeGeometry, material);
  const octahedron = new THREE.Mesh(octahedronGeometry, material);
  sphere.position.x = -3;
  octahedron.position.x = 3;
  scene.add(sphere, plane, octahedron);

  // ブラウザリサイズ対応
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();

  function animate() {
    // オブジェクトの回転
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.x = elapsedTime;
    octahedron.rotation.x = elapsedTime;
    plane.rotation.x = elapsedTime;
    sphere.rotation.y = elapsedTime;
    octahedron.rotation.y = elapsedTime;
    plane.rotation.y = elapsedTime;

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", onWindowResize);
  // マウス操作
  const Controls = new OrbitControls(camera, renderer.domElement);
  animate();
}
