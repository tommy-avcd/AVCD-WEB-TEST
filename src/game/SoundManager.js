// Retro 8-bit sound effects using Web Audio API
export class SoundManager {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (this.ctx) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      this.enabled = false
    }
  }

  play(type) {
    if (!this.enabled || !this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    switch (type) {
      case 'step': this._playStep(); break
      case 'coin': this._playCoin(); break
      case 'combo': this._playCombo(); break
      case 'gameover': this._playGameOver(); break
      case 'start': this._playStart(); break
    }
  }

  _playStep() {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(200, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)
    osc.start(this.ctx.currentTime)
    osc.stop(this.ctx.currentTime + 0.1)
  }

  _playCoin() {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.type = 'square'
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.08)
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2)
    osc.start(this.ctx.currentTime)
    osc.stop(this.ctx.currentTime + 0.2)
  }

  _playCombo() {
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(600 + i * 200, this.ctx.currentTime + i * 0.06)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.08)
      osc.start(this.ctx.currentTime + i * 0.06)
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.08)
    }
  }

  _playGameOver() {
    const freqs = [400, 350, 300, 200]
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.15)
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.15 + 0.15)
      osc.start(this.ctx.currentTime + i * 0.15)
      osc.stop(this.ctx.currentTime + i * 0.15 + 0.15)
    })
  }

  _playStart() {
    const freqs = [300, 400, 500, 800]
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.1)
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.12)
      osc.start(this.ctx.currentTime + i * 0.1)
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.12)
    })
  }
}

export const soundManager = new SoundManager()
