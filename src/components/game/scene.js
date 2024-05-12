import * as THREE from "three";
import images from "src/imagesEnum";
import elementsEnum from "components/game/elementsEnum";
import appConfig from "app/appConfig";

// Rozměry stolu
const tableConfig = appConfig.tableSize // {height: 300, radius: 750}

export default {tableConfig, create, createSky, createEarth, createTable, createTableMaterial}

const textureLoader = new THREE.TextureLoader();
const worldRadius = 5000

// Scéna
function create() {
  const scene = new THREE.Scene()
  // Nastavení světla scény
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  scene.add(directionalLight);
  // Přidání země
  scene.add(createSky())
  scene.add(createEarth())
  return scene
}

// Vytvoření oblohy
function createSky() {
  const skyTexture = textureLoader.load(images.SKY.path)
  skyTexture.repeat.set(1, 1)
  const skyGeometry = new THREE.SphereGeometry(worldRadius)
  const skyMaterial = new THREE.MeshBasicMaterial({map: skyTexture, side: THREE.BackSide})
  return new THREE.Mesh(skyGeometry, skyMaterial)
}


// Generátor země
function createEarth() {
  const earthTexture = textureLoader.load(images.GRASS.path)
  earthTexture.wrapS = THREE.RepeatWrapping
  earthTexture.wrapT = THREE.RepeatWrapping
  earthTexture.repeat.set(10, 10)

  const eartrhmaterial = new THREE.MeshBasicMaterial({
    map: earthTexture,
    side: THREE.DoubleSide
  });
  const earth = new THREE.Mesh(new THREE.CircleGeometry(worldRadius), eartrhmaterial)
  earth.rotateX(Math.PI / 2)
  return earth
}

function createTableMaterial() {
  const woodTexture = textureLoader.load(images.WOOD.path)
  woodTexture.wrapS = THREE.RepeatWrapping
  woodTexture.wrapT = THREE.RepeatWrapping
  woodTexture.repeat.set(5, 5)

  return new THREE.MeshBasicMaterial({
    map: woodTexture,
    side: THREE.DoubleSide
  })

}

function createTable(countEdges = 2,tableMaterial) {
  if (!tableMaterial) tableMaterial = createTableMaterial()

  // Kontrola, že vstupem je číslo a není menší než 4
  countEdges = Math.floor(Number(countEdges))
  if (isNaN(countEdges) || countEdges < 4) return null

  const
    configDepth = tableConfig.radius / 20,
    configHeight = tableConfig.height,
    configRadius = tableConfig.radius,
    configLegRadius = tableConfig.radius / 20

  const table = new THREE.Group();
  // Vytvožení desky stolu
  const deskGeometry =
    new THREE.CylinderGeometry(
      configRadius,
      configRadius,
      configDepth,
      countEdges,
      1,
      false,
      Math.PI / countEdges
    );
  const deskMesh = new THREE.Mesh(deskGeometry, tableMaterial)
  deskMesh.position.y = configHeight - configDepth / 2
  table.add(deskMesh)

  const tempDiameter = (configRadius - configLegRadius) * 0.9
  const startAngle = 2 * Math.PI / countEdges / 2

  // Vytvoření noh stolu
  for (let i = 0; i < countEdges; i++) {
    const legGeometry =
      new THREE.CylinderGeometry(configLegRadius, configLegRadius, configHeight, 32, 1)
    const legMesh = new THREE.Mesh(legGeometry, tableMaterial)
    legMesh.position.z = tempDiameter * Math.cos(2 * i * Math.PI / countEdges - startAngle)
    legMesh.position.x = tempDiameter * Math.sin(2 * i * Math.PI / countEdges - startAngle)
    legMesh.position.y = configHeight / 2
    table.add(legMesh)
  }

  table.name = elementsEnum.TABLE
  return table
}
