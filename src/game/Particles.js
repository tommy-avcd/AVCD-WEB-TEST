// Particle system for dust, sparkles, and effects

export class ParticleSystem {
  constructor() {
    this.particles = []
  }

  emit(x, y, type, count = 5) {
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'dust':
          this.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 2 - 1,
            life: 1,
            decay: 0.03 + Math.random() * 0.02,
            size: 2 + Math.random() * 3,
            color: Math.random() > 0.5 ? '#c8b89a' : '#a89070',
            type: 'dust'
          })
          break
        case 'sparkle':
          this.particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1,
            vy: -Math.random() * 1.5,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            size: 1 + Math.random() * 2,
            color: Math.random() > 0.5 ? '#ffdd44' : '#ffaa00',
            type: 'sparkle'
          })
          break
        case 'coinCollect':
          this.particles.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 4 - 2,
            life: 1,
            decay: 0.03,
            size: 2 + Math.random() * 2,
            color: ['#ffdd44', '#ffaa00', '#ff8833'][Math.floor(Math.random() * 3)],
            type: 'sparkle'
          })
          break
        case 'speedLine':
          this.particles.push({
            x: Math.random() * 400,
            y: y + Math.random() * 200,
            vx: 0,
            vy: 8 + Math.random() * 12,
            life: 1,
            decay: 0.05,
            size: 1,
            width: 1,
            height: 10 + Math.random() * 20,
            color: `rgba(255,255,255,${0.2 + Math.random() * 0.3})`,
            type: 'line'
          })
          break
        case 'comboText':
          this.particles.push({
            x, y,
            vx: 0,
            vy: -2,
            life: 1,
            decay: 0.015,
            size: 16,
            text: count + '',  // abuse count as text
            color: '#ffdd44',
            type: 'text'
          })
          return // only one
      }
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= p.decay
      if (p.type === 'dust') {
        p.vy += 0.05 // gravity
      }
      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life)

      if (p.type === 'text') {
        ctx.fillStyle = p.color
        ctx.font = `bold ${p.size}px monospace`
        ctx.textAlign = 'center'
        ctx.fillText(p.text, p.x, p.y)
      } else if (p.type === 'line') {
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, p.width, p.height)
      } else if (p.type === 'sparkle') {
        ctx.fillStyle = p.color
        // Diamond shape
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(Math.PI / 4)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      } else {
        ctx.fillStyle = p.color
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
    }
    ctx.globalAlpha = 1
  }

  clear() {
    this.particles = []
  }
}
