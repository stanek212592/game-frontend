import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { OrbitControls } from 'import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export default {add}

// Nastavení ovládání
function add(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = true
  controls.enablePan = false
  controls.mouseButtons = {LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE}
  controls.enableZoom = true
  controls.minDistance = 300
  controls.maxDistance = 3000
  controls.minPolarAngle = -1   // Omezíme, aby kamera nemohla jít příliš nízko
  controls.maxPolarAngle = Math.PI / 2.01 // Omezuje pohled tak, aby se nedalo dívat pod horizont roviny
  // controls.minPolarAngle = -1   // Omezíme, aby kamera nemohla jít příliš nízko
  // controls.maxPolarAngle = Math.PI / 2.8 // Omezuje pohled tak, aby se nedalo dívat pod horizont roviny
  // controls.minAzimuthAngle = -Math.PI / 15
  // controls.maxAzimuthAngle = Math.PI / 15
  return controls
}
