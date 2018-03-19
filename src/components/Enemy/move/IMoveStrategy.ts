import 'phaser'
import Enemy from '../Enemy'

interface IMoveStrategy {

  setMovement(enemy: Enemy): void

  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point
}

export default IMoveStrategy