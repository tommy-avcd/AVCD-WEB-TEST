// 16-bit retro pixel art sprite definitions

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

// === CHARACTER SPRITES ===

// Idle frame 1 - standing, hands down
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

// Idle frame 2 - breathing up
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

// Idle frame 3 - panting, mouth open
const CHAR_IDLE_3 = [
  '................',
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SOOS.......',
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

// Running frame 1 - right leg forward
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

// Running frame 2 - mid stride
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

// Running frame 3 - left leg forward
const CHAR_RUN_3 = [
  '................',
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SMMS.......',
  '.....bbbbbb.....',
  '....bBBBBBBb....',
  '...bbBBBBBBbb...',
  '...bBBSSSSBBb...',
  '....SSSSSSSS....',
  '.....SS..SS.....',
  '....SS....SS....',
  '...DD......DD...',
  '...dd......dd...',
  '..ddd......ddd..',
  '................',
]

// Running frame 4 - airborne
const CHAR_RUN_4 = [
  '....rrrrrr......',
  '...rRRRRRRr.....',
  '...rRRRRRRr.....',
  '...rrrrrrrrr....',
  '....SSSSSS......',
  '....SEESSE......',
  '....SSSSSS......',
  '.....SMMS.......',
  '..bbbbbbbb......',
  '..bBBBBBBBb.....',
  '..bBBBBBBBb.bb..',
  '..bBBSSSSBbbBb..',
  '...SSSSSSSS.b...',
  '....SS.........',
  '...SS...........',
  '..DD....DD......',
  '..dd.....dd.....',
  '.ddd......ddd...',
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
  'E': PALETTE.black,
  'M': PALETTE.darkRed,
  'O': PALETTE.white,
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
  charIdle: [parseSprite(CHAR_IDLE_1), parseSprite(CHAR_IDLE_2), parseSprite(CHAR_IDLE_3), parseSprite(CHAR_IDLE_2)],
  charRun: [parseSprite(CHAR_RUN_1), parseSprite(CHAR_RUN_2), parseSprite(CHAR_RUN_3), parseSprite(CHAR_RUN_4)],
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

// Draw a stair block with customizable colors
export function drawStair(ctx, x, y, width, height, theme) {
  const light = theme?.light || PALETTE.stairLight
  const mid = theme?.mid || PALETTE.stairMid
  const dark = theme?.dark || PALETTE.stairDark
  const edge = theme?.edge || PALETTE.stairEdge

  ctx.fillStyle = light
  ctx.fillRect(x, y, width, height)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x, y, width, 2)
  ctx.fillStyle = mid
  ctx.fillRect(x, y + height * 0.4, width, height * 0.3)
  ctx.fillStyle = dark
  ctx.fillRect(x, y + height - 4, width, 4)
  ctx.fillStyle = edge
  ctx.fillRect(x, y, 2, height)
  ctx.fillRect(x + width - 2, y, 2, height)
  ctx.fillStyle = dark
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
  ctx.fillStyle = PALETTE.gold
  ctx.fillRect(cx - w / 2, cy - size / 2, w, size)
  ctx.fillStyle = PALETTE.yellow
  ctx.fillRect(cx - w / 4, cy - size / 3, w / 3, size * 0.3)
  ctx.fillStyle = PALETTE.orange
  ctx.fillRect(cx - w / 2, cy + size / 4, w, size / 4)
  if (squeeze > 0.6) {
    ctx.fillStyle = PALETTE.darkBrown
    ctx.fillRect(cx - 1, cy - 2, 2, 5)
  }
}

export { PALETTE }
