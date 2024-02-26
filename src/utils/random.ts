export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomDigital(min: number, max: number) {
  const randomFraction = Math.random();
  const randomValueInRange = min + randomFraction * (max - min);
  return parseFloat(randomValueInRange.toFixed(18));
}

export function shuffle(array: string[]) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const sleep = async (millis: number) => new Promise((resolve) => setTimeout(resolve, millis));
