// random integer between max and min, both inclusive
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
