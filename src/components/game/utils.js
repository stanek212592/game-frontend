export default {vector, distance, round}

// Pouze
// v rovine x,z
function vector(direction, radius) {
  return {
    x: round(Math.cos(direction) * radius),
    z: round(Math.sin(direction) * radius),
  }
}

function distance(x1, x2, y1, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function round(number, digits = 10) {
  number = Number(number)
  if (isNaN(number)) return null
  return Math.round(number * 10 ** digits) / 10 ** digits
}
