// Nastavení hry
export default {

  scene: {},

  // Nastavení animací a pohybů
  animate: {
    speed: 1,
    stepSize: 8,
    angleSize: Math.PI / 20,
    maxCardsPerRow: 7,
    cardOverlap: 1.3,
    cardAngleView: -Math.PI / 2 - 0.8,
    drawPilePosition: {x: 100, z: 0},
    discardPilePosition: {x: -100, z: 0},
  },

  // Nastavení velikosti karet
  card: {size: 2, width: 50, height: 80, radius: 6, depth: 0.1},

  // Nastavení velikosti stolu
  tableSize: {height: 300, radius: 650},
}
