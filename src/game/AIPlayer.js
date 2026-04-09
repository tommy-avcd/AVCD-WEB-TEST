// AI Player system with progressive difficulty

export class AIPlayer {
  constructor() {
    this.currentStair = 0
    this.score = 0
    this.alive = true
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = 0
    this.stepInterval = 800 // ms between steps (gets faster)
    this.characterId = null
  }

  reset() {
    this.currentStair = 0
    this.score = 0
    this.alive = true
    this.facingRight = true
    this.charState = 'idle'
    this.runAnimTimer = 0
    this.lastStepTime = 0
  }

  // Get mistake rate based on player's floor (AI gets smarter as player progresses)
  getMistakeRate(playerFloor) {
    if (playerFloor < 100) return 0.70   // 70% mistakes - very easy
    if (playerFloor < 500) return 0.50   // 50% mistakes
    if (playerFloor < 1000) return 0.30  // 30% mistakes
    if (playerFloor < 5000) return 0.15  // 15% mistakes
    if (playerFloor < 10000) return 0.10 // 10% mistakes
    return 0.20                           // 20% fixed final difficulty
  }

  // AI decides next move
  update(dt, stairs, playerFloor) {
    if (!this.alive) return

    const now = performance.now()

    // AI step speed scales with player progress
    const speedFactor = 1 + Math.floor(playerFloor / 100) * 0.05
    const currentInterval = Math.max(200, this.stepInterval / speedFactor)

    if (now - this.lastStepTime < currentInterval) return

    this.lastStepTime = now

    const nextStair = stairs[this.currentStair + 1]
    if (!nextStair) return

    const mistakeRate = this.getMistakeRate(playerFloor)

    // AI decides: correct or mistake?
    if (Math.random() < mistakeRate) {
      // Mistake! AI goes wrong direction or stops
      const mistakeType = Math.random()
      if (mistakeType < 0.4) {
        // Wrong direction - dies
        this.alive = false
        this.charState = 'falling'
        return
      } else if (mistakeType < 0.7) {
        // Hesitates - just skips this step (wastes time)
        return
      } else {
        // Stops briefly - longer pause
        this.lastStepTime = now + 300
        return
      }
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
