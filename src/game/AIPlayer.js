// AI Player system with progressive difficulty
// AI doesn't die easily - it just slows down when making mistakes

export class AIPlayer {
  constructor() {
    this.currentStair = 0
    this.score = 0
    this.alive = true
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = 0
    this.stepInterval = 600 // ms between steps
    this.characterId = null
    this.deathFloor = 0 // floor where AI will die (calculated at start)
  }

  reset() {
    this.currentStair = 0
    this.score = 0
    this.alive = true
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = 0
    // AI will survive for a random number of stairs based on difficulty
    this._calculateDeathFloor(0)
  }

  // Calculate when AI will die - it survives longer as player gets better
  _calculateDeathFloor(playerBest) {
    // Base survival: 20-80 stairs at start, increases with player skill
    const minSurvival = 20 + Math.floor(playerBest * 0.3)
    const maxSurvival = 80 + Math.floor(playerBest * 0.8)
    this.deathFloor = minSurvival + Math.floor(Math.random() * (maxSurvival - minSurvival))
  }

  // AI step speed - gets faster as it climbs
  _getStepInterval() {
    // Starts slow, gets faster gradually
    const speedup = Math.min(this.currentStair * 2, 300)
    return Math.max(250, this.stepInterval - speedup)
  }

  // Respawn AI after death with a new random death floor
  respawn(playerFloor) {
    this.alive = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = performance.now() + 1000 // 1s delay before restarting
    this._calculateDeathFloor(playerFloor)
    // AI respawns 5 stairs behind the player
    this.currentStair = Math.max(0, playerFloor - 5)
    this.score = this.currentStair
  }

  update(dt, stairs, playerFloor) {
    if (!this.alive) {
      // Auto-respawn after 2 seconds
      if (!this._deathTime) this._deathTime = performance.now()
      if (performance.now() - this._deathTime > 2000) {
        this._deathTime = null
        this.respawn(playerFloor)
      }
      return
    }

    const now = performance.now()
    const interval = this._getStepInterval()

    if (now - this.lastStepTime < interval) return
    this.lastStepTime = now

    const nextStair = stairs[this.currentStair + 1]
    if (!nextStair) return

    // Check if AI should die at this floor
    if (this.currentStair >= this.deathFloor) {
      // Small chance to die each step past death floor
      if (Math.random() < 0.3) {
        this.alive = false
        this.charState = 'falling'
        return
      }
    }

    // Occasionally hesitate (slow down) - more often at low floors
    const hesitateChance = Math.max(0.02, 0.15 - this.currentStair * 0.001)
    if (Math.random() < hesitateChance) {
      // Just skip this step - wastes time
      this.lastStepTime = now + 200
      return
    }

    // Correct step - AI always goes in the right direction (it's not stupid, just slow)
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
