import 'phaser'
import Enemy from '../Enemy'

interface IAttackStrategy {

  setupProperties(enemy: Enemy): void


  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon


  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer)
}

export default IAttackStrategy