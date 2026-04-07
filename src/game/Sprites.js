// 16-bit retro pixel art sprite definitions
// Each sprite is defined as a 2D pixel array with color indices

const PALETTE = {
  transparent: 'transparent',
  black: '#1a1a2e',
  darkGray: '#4a4a5e',
  gray: '#7a7a8e',
  lightGray: '#b0b0be',
  white: '#e8e8f0',
  skin: '#ffcc99',
  skinDark: '#e6a66e',
  red: '#ff4444',
  darkRed: '#cc2222',
  blue: '#4488ff',
  darkBlue: '#2255cc',
  brown: '#8b5e3c',
  darkBrown: '#5c3a1e',
  yellow: '#ffdd44',
  gold: '#ffaa00',
  green: '#44cc44',
  darkGreen: '#228822',
  orange: '#ff8833',
  pink: '#ff88aa',
  stairLight: '#c8b89a',
  stairMid: '#a89070',
  stairDark: '#7a6048',
  stairEdge: '#5a4030',
}

// Character sprite - 16x24 pixel character
// Idle frame 1
const CHAR_IDLE_1 = [
  '................',
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SMMS.......',
  '....bbbbbb......',
  '...bBBBBBBb.....',
  '...bBBBBBBb.....',
  '...bBSSSSBb.....',
  '....SSSSSS......',
  '....SS..SS......',
  '....SS..SS......',
  '....DD..DD......',
  '....dd..dd......',
  '...ddd..ddd.....',
  '................',
]

// Idle frame 2 (breathing - slightly raised)
const CHAR_IDLE_2 = [
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SMMS.......',
  '....bbbbbb......',
  '...bBBBBBBb.....',
  '...bBBBBBBb.....',
  '...bBSSSSBb.....',
  '....SSSSSS......',
  '....SS..SS......',
  '....SS..SS......',
  '....DD..DD......',
  '....dd..dd......',
  '...ddd..ddd.....',
  '................',
  '................',
]

// Running frame 1
const CHAR_RUN_1 = [
  '................',
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SMMS.......',
  '...bbbbbb.......',
  '..bBBBBBBb......',
  '..bBBBBBBb.bb...',
  '..bBSSSSBbbBb...',
  '...SSSSSS..b....',
  '...SS...SS......',
  '..SS.....SS.....',
  '..DD......DD....',
  '..dd......dd....',
  '.ddd.....ddd....',
  '................',
]

// Running frame 2
const CHAR_RUN_2 = [
  '................',
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SMMS.......',
  '....bbbbbb......',
  '...bBBBBBBb.....',
  '..bbBBBBBBb.....',
  '..bBBSSSSBb.....',
  '...SSSSSSS......',
  '....SSSS........',
  '...DD..DD.......',
  '..dd....dd......',
  '.ddd....ddd.....',
  '................',
  '................',
]

// Falling frame
const CHAR_FALL = [
  '................',
  '......rrrrrr....',
  '.....rRRRRRRr...',
  '.....rRRRRRRr...',
  '.....rrrrrrrrr..',
  '......SSSSSS....',
  '......SOOSSO....',
  '......SSSSSS....',
  '.......SOOOS....',
  '.bb..bbbbbb.....',
  '.bBbbBBBBBBb....',
  '..bbBBBBBBb.....',
  '....BSSSSSB.....',
  '.....SSSSSS.....',
  '....SS....SS....',
  '...SS......SS...',
  '...DD......DD...',
  '...dd......dd...',
  '..ddd......ddd..',
  '................',
]

const SPRITE_MAP = {
  '.': 'transparent',
  'r': PALETTE.darkRed,
  'R': PALETTE.red,
  'S': PALETTE.skin,
  's': PALETTE.skinDark,
  'E': PALETTE.black,  // eyes
  'M': PALETTE.darkRed, // mouth
  'O': PALETTE.white,   // surprised eyes
  'b': PALETTE.darkBlue,
  'B': PALETTE.blue,
  'D': PALETTE.darkBrown,
  'd': PALETTE.brown,
}

function parseSprite(data) {
  return data.map(row =>
    row.split('').map(ch => SPRITE_MAP[ch] || 'transparent')
  )
}

export const SPRITES = {
  charIdle: [parseSprite(CHAR_IDLE_1), parseSprite(CHAR_IDLE_2)],
  charRun: [parseSprite(CHAR_RUN_1), parseSprite(CHAR_RUN_2)],
  charFall: parseSprite(CHAR_FALL),
}

// Draw a parsed sprite to canvas
export function drawSprite(ctx, sprite, x, y, pixelSize, flip = false) {
  const h = sprite.length
  const w = sprite[0].length

  ctx.save()
  if (flip) {
    ctx.translate(x + w * pixelSize, y)
    ctx.scale(-1, 1)
    x = 0
    y = 0
  }

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const color = sprite[row][col]
      if (color === 'transparent') continue
      ctx.fillStyle = color
      ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize)
    }
  }
  ctx.restore()
}

// Draw a stair block
export function drawStair(ctx, x, y, width, height) {
  // Main body
  ctx.fillStyle = PALETTE.stairLight
  ctx.fillRect(x, y, width, height)

  // Top highlight
  ctx.fillStyle = PALETTE.white
  ctx.fillRect(x, y, width, 2)

  // Mid tone
  ctx.fillStyle = PALETTE.stairMid
  ctx.fillRect(x, y + height * 0.4, width, height * 0.3)

  // Bottom shadow
  ctx.fillStyle = PALETTE.stairDark
  ctx.fillRect(x, y + height - 4, width, 4)

  // Left edge
  ctx.fillStyle = PALETTE.stairEdge
  ctx.fillRect(x, y, 2, height)

  // Right edge
  ctx.fillStyle = PALETTE.stairEdge
  ctx.fillRect(x + width - 2, y, 2, height)

  // Pixel detail - brick lines
  ctx.fillStyle = PALETTE.stairDark
  for (let i = 0; i < Math.floor(width / 16); i++) {
    ctx.fillRect(x + 8 + i * 16, y + 6, 1, height - 12)
  }
  ctx.fillRect(x + 4, y + Math.floor(height / 2), width - 8, 1)
}

// Draw coin sprite
export function drawCoin(ctx, x, y, size, frame) {
  const squeeze = Math.abs(Math.sin(frame * 0.1)) * 0.6 + 0.4
  const w = size * squeeze
  const cx = x + size / 2
  const cy = y + size / 2

  // Coin body
  ctx.fillStyle = PALETTE.gold
  ctx.fillRect(cx - w / 2, cy - size / 2, w, size)

  // Highlight
  ctx.fillStyle = PALETTE.yellow
  ctx.fillRect(cx - w / 4, cy - size / 3, w / 3, size * 0.3)

  // Shadow
  ctx.fillStyle = PALETTE.orange
  ctx.fillRect(cx - w / 2, cy + size / 4, w, size / 4)

  // Dollar sign
  if (squeeze > 0.6) {
    ctx.fillStyle = PALETTE.darkBrown
    ctx.fillRect(cx - 1, cy - 2, 2, 5)
  }
}

export { PALETTE }
