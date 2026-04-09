// AI Player - respawns with increasing intelligence
// Intelligence: 0-100, grows by 25 each respawn
// At max intelligence: mistakes 1 in 1000 stairs

import { getRandomCharacter } from './Characters.js'

export class AIPlayer {
  constructor() {
    this.currentStair = 0
    this.score = 0
    this.alive = true
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = 0
    this.stepInterval = 500
    this.character = null
    this.intelligence = 0  // 0-100
    this.generation = 1    // which AI we're on
    this.deathTime = 0
    this.deathMessage = ''
    this.showDeath = false
    this.stairsSinceLastMistake = 0
  }

  reset() {
    this.currentStair = 0
    this.score = 0
    this.alive = true
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = performance.now()
    this.intelligence = 0
    this.generation = 1
    this.deathTime = 0
    this.showDeath = false
    this.stairsSinceLastMistake = 0
    this.character = getRandomCharacter()
  }

  // Respawn with new character and higher intelligence
  _respawn(playerFloor) {
    this.intelligence = Math.min(100, this.intelligence + 25)
    this.generation++
    this.character = getRandomCharacter()
    this.alive = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.showDeath = false
    this.stairsSinceLastMistake = 0
    // Respawn slightly behind player
    this.currentStair = Math.max(0, playerFloor - 3)
    this.score = this.currentStair
    this.lastStepTime = performance.now() + 500
  }

  // How often AI makes mistakes based on intelligence
  // intelligence 0: 1 mistake per 20 stairs
  // intelligence 25: 1 mistake per 80 stairs
  // intelligence 50: 1 mistake per 200 stairs
  // intelligence 75: 1 mistake per 500 stairs
  // intelligence 100: 1 mistake per 1000 stairs
  _getMistakeInterval() {
    if (this.intelligence >= 100) return 1000
    if (this.intelligence >= 75) return 500
    if (this.intelligence >= 50) return 200
    if (this.intelligence >= 25) return 80
    return 20
  }

  // AI step speed - faster as intelligence grows
  _getStepSpeed() {
    // Base interval decreases with intelligence
    const base = 500 - this.intelligence * 2.5 // 500ms at 0, 250ms at 100
    return Math.max(200, base)
  }

  update(dt, stairs, playerFloor) {
    // Handle death + respawn
    if (!this.alive) {
      if (this.deathTime === 0) {
        this.deathTime = performance.now()
        this.showDeath = true
        this.deathMessage = `CPU #${this.generation} DOWN! (IQ: ${this.intelligence})`
      }
      // Respawn after 1.5 seconds
      if (performance.now() - this.deathTime > 1500) {
        this.deathTime = 0
        this._respawn(playerFloor)
      }
      return
    }

    const now = performance.now()
    const interval = this._getStepSpeed()

    if (now - this.lastStepTime < interval) return
    this.lastStepTime = now

    const nextStair = stairs[this.currentStair + 1]
    if (!nextStair) return

    this.stairsSinceLastMistake++

    // Check for mistake
    const mistakeInterval = this._getMistakeInterval()
    if (this.stairsSinceLastMistake >= mistakeInterval) {
      // Time to make a mistake - AI dies
      this.stairsSinceLastMistake = 0
      this.alive = false
      this.charState = 'falling'
      return
    }

    // Correct step
    this.facingRight = nextStair.direction === 'right'
    this.currentStair++
    this.score = this.currentStair
    this.charState = 'running'
    this.runAnimTimer = 200
  }

  updateAnimation(dt) {
    if (this.runAnimTimer > 0) {
      this.runAnimTimer -= dt
      if (this.runAnimTimer <= 0) {
        this.charState = this.alive ? 'idle' : 'falling'
      }
    }
  }
}
