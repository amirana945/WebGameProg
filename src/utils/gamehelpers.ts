import * as Phaser from 'phaser-ce'


export const skipBuiltinTypeChecks = (): void => {
    Phaser['Component'].Core.skipTypeChecks = true
}


export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomYPos(height: number): number {
  let v = height * 0.2
  return randomInRange(v, height - v)
}
export function randomXPos(width: number): number {
  let v = width * 0.1
  return randomInRange(v, width - v)
}

export const checkOnOrOutOfBounds = (body: any, game: Phaser.Game): boolean => {
  const { position } = body
  const { width, height } = game
  const pad = 3
  return position.x <= pad || position.x >= width - pad || position.y <= pad || position.y >= height - pad
}

export const uuid = (): string => {
  return '_' + Math.random().toString(36).substr(2, 9);
}
