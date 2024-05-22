import {game} from "stores/game";
import Scene from "components/game/scene";
import utils from "components/game/utils";
import gameStatesEnum from "components/game/gameStatesEnum";
import appConfig from "app/appConfig";

export default {moveCardVertically, moveCard, rotateCardTo, rotateCardBy, moveCardTo, shuffleIfNeeded}

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

// Míchání karet
async function shuffleIfNeeded(scene, drawPileObject,callback) {
  if (game().drawPileCardsIds.length === 0) {
    const cards = []

    const discard = game().discardPileCardsIds
    const lastCardId = discard[discard.length - 1]
    const shuffled = discard.slice(0, -1);
    for (const id of shuffled) {
      const card = game().gameCards.find(c => c.params.cardId === id)
      await moveCard(card, appConfig.card.height * 1.1)
      await moveCardVertically(card, undefined, Scene.tableConfig.height + 75 + cards.length)
      await rotateCardTo(card, Math.PI / 2, 0, 0)
      card.hidePicture(true)
      await moveCardVertically(card, undefined, Scene.tableConfig.height + 150 + cards.length)
      cards.push(card)
    }

    if (cards.length > 2)
      for (let i = 0; i < 50; i++) {
        const index = Math.floor(Math.random() * cards.length)
        const randCard = cards[index];
        await moveCard(randCard, 100, undefined, 15)
        await moveCardVertically(randCard, 15, Scene.tableConfig.height + 150 + cards.length + i)
        await moveCard(randCard, 100, 2 * Math.PI, 15)
        for (let j = 0; j < cards.length; j++) {
          const randCard = cards[j];
          await moveCardVertically(randCard, 15, Scene.tableConfig.height + 150 + cards.length + j)
        }
      }

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      await moveCardTo(card, appConfig.animate.drawPilePosition, undefined, 15)
      await moveCardVertically(card, 15, Scene.tableConfig.height + i * 0.5)
      game().drawPileCardsIds.push(card.params.cardId)
      scene.remove(card)
      scene.remove(drawPileObject)
      callback()
    }
    game().drawPileCardsIds = shuffleArray(shuffled)
    game().discardPileCardsIds = [lastCardId]
    const lastCard = game().gameCards.find(c => c.params.cardId === lastCardId)
    await moveCardVertically(lastCard, 15, Scene.tableConfig.height + appConfig.card.depth)
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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
