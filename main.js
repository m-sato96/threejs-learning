import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

window.addEventListener("load", init);

function init() {
  //UIデバッグ
  const gui = new GUI();

  //サイズ
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //シーン
  const scene = new THREE.Scene();

  //カメラ
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.set(1, 1, 2);

  //レンダラー
  const renderer = new THREE.WebGLRenderer({
    // alpha: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // テクスチャ設定
  const textureLoader = new THREE.TextureLoader();
  const particlesTexture = textureLoader.load("./textures/particles/1.png");

  /**
   * パーティクル
   */
  // ジオメトリ
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1000;
  const positionArray = new Float32Array(count * 3);
  const colorArray = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10;
    colorArray[i] = Math.random();
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

  // マテリアル
  const pointMaterial = new THREE.PointsMaterial({
    size: 0.02,
    transparent: true,
    alphaMap: particlesTexture,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    // color: "blue",
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  // メッシュ
  const particles = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(particles);

  //マウス操作
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = particlesGeometry.attributes.position.array[i3];
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    //レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  //ブラウザのリサイズに対応
  function onWindowResize() {
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onWindowResize);
  animate();
}
