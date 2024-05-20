import {game} from "stores/game";
import Scene from "components/game/scene";
import utils from "components/game/utils";
import gameStatesEnum from "components/game/gameStatesEnum";

export default {moveCardVertically, moveCard, rotateCardTo, rotateCardBy, moveCardTo}

// Zvedání karty
async function moveCardVertically(card, stepSize = game().animate.stepSize, finalLevel = Scene.tableConfig.height + 150) {
  const direction = Math.sign(finalLevel - card.position.y)
  if (!stepSize) stepSize = game().animate.stepSize
  stepSize *= game().speed
  let animationFrameId = null
  return new Promise((resolve) => {
    const animate = () => {
      if (game().state === gameStatesEnum.NO_GAME) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        resolve(false);
        return;
      }

      if (Math.abs(card.position.y - finalLevel) <= stepSize) {
        card.position.y = finalLevel
        resolve(true)
        return
      }

      card.position.y += direction * stepSize

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  })
}


// Pophyb karty dle směru a vzálenosti
async function moveCard(card, distance = 100, direction = Math.PI, stepSize = game().animate.stepSize,) {
  stepSize *= game().speed
  let position = 0
  const vector = utils.vector(direction, stepSize)
  let animationFrameId = null
  return new Promise((resolve) => {
    const animate = () => {
      if (distance - position <= stepSize) {
        resolve(true)
        return
      }
      card.position.x += vector.x
      card.position.z += vector.z
      position += stepSize

      if (game().state === gameStatesEnum.NO_GAME) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        resolve(false);
        return;
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  })
}

// Otočení karty na specifiický úhel v určité ose
async function rotateCardTo(card, targetAngleX = null, targetAngleY = null, targetAngleZ = null) {
  const angleStep = game().animate.angleSize * game().speed
  const signX = Math.sign(1 / targetAngleX)
  const signZ = Math.sign(1 / targetAngleZ)
  const signY = Math.sign(1 / targetAngleY)
  let animationFrameId = null
  return new Promise((resolve) => {
    const animate = () => {
      if (targetAngleX != null && Math.abs(targetAngleX - card.rotation.x) <= angleStep) {
        card.rotation.x += angleStep * signX
      } else if (targetAngleX != null) {
        card.rotation.x = targetAngleX
        targetAngleX = null
      }
      if (targetAngleY != null && Math.abs(targetAngleY - card.rotation.y) <= angleStep) {
        card.rotation.y += angleStep * signY
      } else if (targetAngleY != null) {
        card.rotation.y = targetAngleY
        targetAngleY = null
      }
      if (targetAngleZ != null && Math.abs(targetAngleZ - card.rotation.z) <= angleStep) {
        card.rotation.z += angleStep * signZ
      } else if (targetAngleZ != null) {
        card.rotation.z = targetAngleZ
        targetAngleZ = null
      }
      if (targetAngleX === null && targetAngleY === null && targetAngleZ === null) {
        resolve(true)
        return
      }
      if (game().state === gameStatesEnum.NO_GAME) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        resolve(false);
        return;
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  })
}

// Otočení karty o úhel v ose
async function rotateCardBy(card, angleX = null, angleY = null, angleZ = null) {
  const angleStep = game().animate.angleSize * game().speed
  const stepsX = !angleX ? null : Math.abs(Math.ceil(angleX / angleStep))
  const stepsY = !angleY ? null : Math.abs(Math.ceil(angleY / angleStep))
  const stepsZ = !angleZ ? null : Math.abs(Math.ceil(angleZ / angleStep))
  let counter = 0
  let animationFrameId = null
  return new Promise((resolve) => {
    const animate = () => {
      if (stepsX && stepsX > counter) card.rotateX(angleX / stepsX)
      if (stepsY && stepsY > counter) card.rotateY(angleY / stepsY)
      if (stepsZ && stepsZ > counter) card.rotateZ(angleZ / stepsZ)
      if (Math.max(stepsX, stepsZ, stepsY) === counter) {
        resolve(true)
        return
      }
      counter++
      if (game().state === gameStatesEnum.NO_GAME) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        resolve(false);
        return;
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  })
}


// Pophyb karty do pozice s možností natočení karty
async function moveCardTo(card, destination = {x: 0, z: 0}, targetAngleZ = null, stepSize = game().animate.stepSize) {
  destination.x = utils.round(destination.x)
  destination.z = utils.round(destination.z)
  stepSize *= game().speed
  let angleSize = game().animate.angleSize * game().speed
  const cardPosi = card.position
  let position = 0
  const direction = Math.atan2(destination.z - cardPosi.z, destination.x - cardPosi.x)
  const vector = utils.vector(direction, stepSize)
  const distance = utils.distance(cardPosi.x, destination.x, cardPosi.z, destination.z)
  let animationFrameId = null
  return new Promise((resolve) => {
    const animate = () => {
      const remainingDistance = distance - position

      // Posunutí ve směru translace
      if (remainingDistance <= stepSize) {
        card.position.x = destination.x
        card.position.z = destination.z
        position = distance // Ensure position reaches the exact distance
      } else {
        card.position.x += vector.x
        card.position.z += vector.z
        position += stepSize
      }

      // Pokud je definován cílový úhel natočení ve směru z
      if (targetAngleZ !== null) {
        const angleDiff = targetAngleZ - card.rotation.z
        if (Math.abs(angleDiff) <= angleSize) {
          card.rotation.z = targetAngleZ
          targetAngleZ = null
        } else {
          card.rotation.z += Math.sign(angleDiff) * angleSize
        }
      }

      if (remainingDistance <= stepSize && targetAngleZ === null) {
        resolve(true)
        return
      }

      if (game().state === gameStatesEnum.NO_GAME) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
        resolve(false)
        return
      }

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  })
}
