import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.18/+esm";

/**
 * UIデバッグ
 */
const gui = new GUI();

window.addEventListener("load", init);

function init() {
  // シーンの追加
  const scene = new THREE.Scene();

  // カメラの追加
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 500);

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

  // テクスチャの追加
  const texture = new THREE.TextureLoader().load("./textures/earth.jpg");

  // ジオメトリ作成
  const ballGeometry = new THREE.SphereGeometry(100, 64, 32);

  // マテリアル作成
  const ballMaterial = new THREE.MeshPhysicalMaterial({ map: texture });

  // メッシュ化
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  // 平行光源の追加
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  // 光の当たる位置調整
  directionalLight.position.set(1, 1, 1);
  // シーンに追加
  scene.add(directionalLight);

  // ポイント光源を追加
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  // マウス操作
  const Controls = new OrbitControls(camera, renderer.domElement);

  const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
  const boxMaterial = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(boxGeometry, boxMaterial);
  cube.position.set(100, -30, 100);
  scene.add(cube);

  // デバッグ
  gui.add(cube.position, "x");

  // アニメーション
  function animate() {
    // ボックスジオメトリ回転角度を更新する
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // 球体ジオメトリのpontLightポジションを動的に指定
    pointLight.position.set(
      200 * Math.sin(Date.now() / 500),
      200 * Math.sin(Date.now() / 1000),
      200 * Math.cos(Date.now() / 500)
    );
    // フレーム単位で関数実行
    requestAnimationFrame(animate);

    // レンダリング関数
    renderer.render(scene, camera);
  }

  // ブラウザリサイズ対応
  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onWindowResize);
  animate();

  // renderer.render(scene, camera);
}
