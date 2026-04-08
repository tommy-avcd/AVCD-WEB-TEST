// Crowd celebration system - people from different countries cheer at milestones

const COUNTRIES = [
  { name: 'Japan', floor: 100, colors: ['#ffffff', '#cc0000'], hat: '#cc0000', costume: '#ffffff' },
  { name: 'UK', floor: 200, colors: ['#002366', '#cc0000', '#ffffff'], hat: '#002366', costume: '#cc0000' },
  { name: 'India', floor: 300, colors: ['#ff9933', '#ffffff', '#138808'], hat: '#ff9933', costume: '#ffffff' },
  { name: 'Italy', floor: 400, colors: ['#009246', '#ffffff', '#cc0000'], hat: '#009246', costume: '#ffffff' },
  { name: 'France', floor: 500, colors: ['#0055a4', '#ffffff', '#ef4135'], hat: '#0055a4', costume: '#ffffff' },
  { name: 'Spain', floor: 600, colors: ['#cc0000', '#ffcc00'], hat: '#cc0000', costume: '#ffcc00' },
  { name: 'Netherlands', floor: 700, colors: ['#ff6600', '#ffffff', '#002366'], hat: '#ff6600', costume: '#ffffff' },
  { name: 'Korea', floor: 800, colors: ['#ffffff', '#0047a0', '#cd2e3a'], hat: '#0047a0', costume: '#ffffff' },
  { name: 'Denmark', floor: 900, colors: ['#cc0000', '#ffffff'], hat: '#cc0000', costume: '#ffffff' },
  { name: 'Portugal', floor: 1000, colors: ['#006600', '#ff0000'], hat: '#006600', costume: '#ff0000' },
  { name: 'Brazil', floor: 1100, colors: ['#009c3b', '#ffdf00'], hat: '#009c3b', costume: '#ffdf00' },
  { name: 'Germany', floor: 1200, colors: ['#000000', '#dd0000', '#ffcc00'], hat: '#000000', costume: '#dd0000' },
  { name: 'Mexico', floor: 1300, colors: ['#006847', '#ffffff', '#ce1126'], hat: '#006847', costume: '#ffffff' },
  { name: 'China', floor: 1400, colors: ['#de2910', '#ffde00'], hat: '#de2910', costume: '#ffde00' },
  { name: 'Russia', floor: 1500, colors: ['#ffffff', '#0039a6', '#d52b1e'], hat: '#0039a6', costume: '#ffffff' },
  { name: 'Australia', floor: 1600, colors: ['#002868', '#ffffff', '#ffcc00'], hat: '#002868', costume: '#ffcc00' },
  { name: 'Argentina', floor: 1700, colors: ['#74acdf', '#ffffff'], hat: '#74acdf', costume: '#ffffff' },
  { name: 'Egypt', floor: 1800, colors: ['#ce1126', '#ffffff', '#000000'], hat: '#ce1126', costume: '#ffffff' },
  { name: 'Sweden', floor: 1900, colors: ['#006aa7', '#fecc02'], hat: '#006aa7', costume: '#fecc02' },
  { name: 'Thailand', floor: 2000, colors: ['#a51931', '#f4f5f8', '#2d2a4a'], hat: '#a51931', costume: '#f4f5f8' },
  { name: 'Nigeria', floor: 2100, colors: ['#008751', '#ffffff'], hat: '#008751', costume: '#ffffff' },
  { name: 'Greece', floor: 2200, colors: ['#0d5eaf', '#ffffff'], hat: '#0d5eaf', costume: '#ffffff' },
  { name: 'Canada', floor: 2300, colors: ['#ff0000', '#ffffff'], hat: '#ff0000', costume: '#ffffff' },
  { name: 'Turkey', floor: 2400, colors: ['#e30a17', '#ffffff'], hat: '#e30a17', costume: '#ffffff' },
  { name: 'Colombia', floor: 2500, colors: ['#fcd116', '#003893', '#ce1126'], hat: '#fcd116', costume: '#003893' },
  { name: 'Poland', floor: 2600, colors: ['#ffffff', '#dc143c'], hat: '#dc143c', costume: '#ffffff' },
  { name: 'SouthAfrica', floor: 2700, colors: ['#007a4d', '#ffb612', '#de3831'], hat: '#007a4d', costume: '#ffb612' },
  { name: 'Norway', floor: 2800, colors: ['#ef2b2d', '#002868', '#ffffff'], hat: '#ef2b2d', costume: '#ffffff' },
  { name: 'Ireland', floor: 2900, colors: ['#009a49', '#ffffff', '#ff7900'], hat: '#009a49', costume: '#ffffff' },
  { name: 'Peru', floor: 3000, colors: ['#d91023', '#ffffff'], hat: '#d91023', costume: '#ffffff' },
  { name: 'Philippines', floor: 3100, colors: ['#0038a8', '#ce1126', '#fcd116'], hat: '#0038a8', costume: '#fcd116' },
  { name: 'Vietnam', floor: 3200, colors: ['#da251d', '#ffcd00'], hat: '#da251d', costume: '#ffcd00' },
  { name: 'Chile', floor: 3300, colors: ['#d52b1e', '#ffffff', '#0039a6'], hat: '#0039a6', costume: '#ffffff' },
  { name: 'Belgium', floor: 3400, colors: ['#000000', '#fae042', '#ed2939'], hat: '#000000', costume: '#fae042' },
  { name: 'Czech', floor: 3500, colors: ['#ffffff', '#d7141a', '#11457e'], hat: '#11457e', costume: '#ffffff' },
  { name: 'Austria', floor: 3600, colors: ['#ed2939', '#ffffff'], hat: '#ed2939', costume: '#ffffff' },
  { name: 'Switzerland', floor: 3700, colors: ['#ff0000', '#ffffff'], hat: '#ff0000', costume: '#ffffff' },
  { name: 'Morocco', floor: 3800, colors: ['#c1272d', '#006233'], hat: '#c1272d', costume: '#006233' },
  { name: 'Ukraine', floor: 3900, colors: ['#0057b7', '#ffd700'], hat: '#0057b7', costume: '#ffd700' },
  { name: 'Jamaica', floor: 4000, colors: ['#009b3a', '#fed100', '#000000'], hat: '#fed100', costume: '#009b3a' },
  { name: 'Finland', floor: 4100, colors: ['#ffffff', '#003580'], hat: '#003580', costume: '#ffffff' },
  { name: 'Malaysia', floor: 4200, colors: ['#cc0001', '#ffffff', '#010066'], hat: '#010066', costume: '#cc0001' },
  { name: 'Cuba', floor: 4300, colors: ['#002a8f', '#ffffff', '#cb1515'], hat: '#cb1515', costume: '#002a8f' },
  { name: 'NewZealand', floor: 4400, colors: ['#000000', '#ffffff', '#cc142b'], hat: '#000000', costume: '#ffffff' },
  { name: 'Iceland', floor: 4500, colors: ['#003897', '#d72828', '#ffffff'], hat: '#003897', costume: '#ffffff' },
  { name: 'Kenya', floor: 4600, colors: ['#000000', '#bb0000', '#006600'], hat: '#bb0000', costume: '#006600' },
  { name: 'Singapore', floor: 4700, colors: ['#ee2536', '#ffffff'], hat: '#ee2536', costume: '#ffffff' },
  { name: 'Nepal', floor: 4800, colors: ['#dc143c', '#003893'], hat: '#dc143c', costume: '#003893' },
  { name: 'Israel', floor: 4900, colors: ['#0038b8', '#ffffff'], hat: '#0038b8', costume: '#ffffff' },
  { name: 'World', floor: 5000, colors: ['#ffdd44', '#44cc44', '#4488ff', '#ff4444'], hat: '#ffdd44', costume: '#44cc44' },
]

export class CrowdSystem {
  constructor() {
    this.activeCrowd = null
    this.people = []
    this.timer = 0
  }

  update(currentFloor, dt) {
    // Check if we should activate a crowd
    for (const country of COUNTRIES) {
      if (currentFloor >= country.floor && currentFloor < country.floor + 10) {
        if (!this.activeCrowd || this.activeCrowd.name !== country.name) {
          this._spawnCrowd(country)
        }
        break
      }
    }

    // Deactivate if past range
    if (this.activeCrowd) {
      const endFloor = this.activeCrowd.floor + 10
      if (currentFloor >= endFloor) {
        this.activeCrowd = null
        this.people = []
      }
    }

    // Animate people
    this.timer += dt
    for (const p of this.people) {
      // Jumping animation
      p.jumpPhase += p.jumpSpeed
      p.yOffset = -Math.abs(Math.sin(p.jumpPhase)) * p.jumpHeight
      // Arm waving
      p.armPhase += 0.05 + Math.random() * 0.02
    }
  }

  _spawnCrowd(country) {
    this.activeCrowd = country
    this.people = []
    for (let i = 0; i < 50; i++) {
      this.people.push({
        x: (i / 50) * 1.2 - 0.1, // 0-1 normalized screen x with some overflow
        baseY: 0.82 + Math.random() * 0.15,
        yOffset: 0,
        jumpPhase: Math.random() * Math.PI * 2,
        jumpSpeed: 0.06 + Math.random() * 0.04,
        jumpHeight: 5 + Math.random() * 10,
        armPhase: Math.random() * Math.PI * 2,
        size: 0.6 + Math.random() * 0.5,
        colorIdx: Math.floor(Math.random() * country.colors.length),
        hat: country.hat,
        costume: country.costume,
      })
    }
  }

  draw(ctx, w, h) {
    if (!this.activeCrowd || this.people.length === 0) return

    // Country name banner
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, h * 0.75, w, 28)
    ctx.fillStyle = this.activeCrowd.colors[0]
    ctx.font = 'bold 14px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`${this.activeCrowd.name} CHEERING!`, w / 2, h * 0.75 + 19)

    // Draw people
    for (const p of this.people) {
      const px = p.x * w
      const py = p.baseY * h + p.yOffset
      const s = p.size * 8

      // Body (costume color)
      ctx.fillStyle = p.costume
      ctx.fillRect(px - s * 0.4, py - s * 1.5, s * 0.8, s * 1.2)

      // Head (skin)
      ctx.fillStyle = '#ffcc99'
      ctx.fillRect(px - s * 0.3, py - s * 2.2, s * 0.6, s * 0.7)

      // Hat
      ctx.fillStyle = p.hat
      ctx.fillRect(px - s * 0.4, py - s * 2.5, s * 0.8, s * 0.4)

      // Arms waving
      const armY = Math.sin(p.armPhase) * s * 0.6
      ctx.fillStyle = p.costume
      ctx.fillRect(px - s * 0.8, py - s * 1.3 + armY, s * 0.3, s * 0.15)
      ctx.fillRect(px + s * 0.5, py - s * 1.3 - armY, s * 0.3, s * 0.15)

      // Legs
      ctx.fillStyle = '#333355'
      ctx.fillRect(px - s * 0.3, py - s * 0.3, s * 0.25, s * 0.5)
      ctx.fillRect(px + s * 0.05, py - s * 0.3, s * 0.25, s * 0.5)
    }
  }
}
