import * as THREE from 'three'
import imagesEnum from "src/images/imagesEnum";
import elementsEnum from "components/game/elementsEnum";

//  Definice rozměrů karty
const config = {size: 2, width: 50, height: 80, radius: 6, depth: 0.1}
export default {config, createCard, select}

const textureLodaer = new THREE.TextureLoader()

// Vytvoření karet
function createCard(countOfCards, name = elementsEnum.DROW_PILE, frontPicture = null, cardParams = null) {
    // Kontrola, že vstupem je číslo a není menší než 1
    countOfCards = Math.floor(Number(countOfCards))
    if (isNaN(countOfCards) || countOfCards < 1) return null

    const configwidth = config.width * config.size,
        configheight = config.height * config.size,
        configradius = config.radius * config.size,
        configframe = config.radius,
        configdepth = config.depth * config.size

    // Vytvoření rámečku karty
    const cardFrameShape = new THREE.Shape()
    cardFrameShape.moveTo(0, configradius)
    cardFrameShape.lineTo(0, configheight - configradius)
    cardFrameShape.quadraticCurveTo(0, configheight, configradius, configheight)
    cardFrameShape.lineTo(configwidth - configradius, configheight)
    cardFrameShape.quadraticCurveTo(configwidth, configheight, configwidth, configheight - configradius)
    cardFrameShape.lineTo(configwidth, configradius)
    cardFrameShape.quadraticCurveTo(configwidth, 0, configwidth - configradius, 0)
    cardFrameShape.lineTo(configradius, 0)
    cardFrameShape.quadraticCurveTo(0, 0, 0, configradius)
    const cardFrameHoleForPicture = new THREE.Path()
    cardFrameHoleForPicture.moveTo(configframe, configframe)
    cardFrameHoleForPicture.lineTo(configwidth - configframe, configframe)
    cardFrameHoleForPicture.lineTo(configwidth - configframe, configheight - configframe)
    cardFrameHoleForPicture.lineTo(configframe, configheight - configframe)
    cardFrameHoleForPicture.lineTo(configframe, configframe)
    cardFrameShape.holes.push(cardFrameHoleForPicture)
    const extrudeSettings = {
        steps: 1,
        depth: configdepth * countOfCards,
        bevelEnabled: false,
    }
    const cardFrameGeometry = new THREE.ExtrudeGeometry(cardFrameShape, extrudeSettings)
    const cardFrameMaterial = new THREE.MeshBasicMaterial({color: '#000000'})
    const cardFrame = new THREE.Mesh(cardFrameGeometry, cardFrameMaterial)

    // Vytvoření rubu a líce karty
    const cardCenterGeometry = new THREE.BoxGeometry(configwidth - 2 * configframe, configheight - 2 * configframe, configdepth * countOfCards)
    const cardCenterMaterialNoImg = [
        cardFrameMaterial, // R
        cardFrameMaterial, // L
        cardFrameMaterial, // T
        cardFrameMaterial, // B
        cardFrameMaterial, // FACE
        new THREE.MeshBasicMaterial({map: textureLodaer.load(imagesEnum.CARD_BACK.path)}), // BACK
    ]

    const cardCenterMaterialImg = !frontPicture ? null : [
        cardFrameMaterial, // R
        cardFrameMaterial, // L
        cardFrameMaterial, // T
        cardFrameMaterial, // B
        new THREE.MeshBasicMaterial({map: textureLodaer.load(frontPicture.path)}), // FACE
        new THREE.MeshBasicMaterial({map: textureLodaer.load(imagesEnum.CARD_BACK.path)}), // BACK
    ]


    const cardPicture = new THREE.Mesh(cardCenterGeometry, !frontPicture ? cardCenterMaterialNoImg : cardCenterMaterialImg)

    // Vytvoření karty - spojení rámečku se středem karty
    const card = new THREE.Group()
    cardFrame.position.x -= configwidth / 2
    cardFrame.position.y -= configheight / 2
    cardFrame.position.z -= configdepth * countOfCards / 2
    cardFrame.name = elementsEnum.CARD_FRAME
    card.add(cardFrame)
    card.add(cardPicture)
    card.rotateX(Math.PI / 2)
    // card.position.y = depth * countOfCards / 2
    card.name = name
    card.params = {
        ...cardParams,
    }
    card.select = (value = true) => {
        if (value) cardFrame.material = new THREE.MeshBasicMaterial({color: '#ea7c01'})
        else cardFrame.material = cardFrameMaterial
    }
    if (frontPicture)
        card.hidePicture = (value = true) => {
            cardPicture.material = !value ? cardCenterMaterialImg : cardCenterMaterialNoImg
        }
    return card


}

function select(value) {
    console.log(value)
}
