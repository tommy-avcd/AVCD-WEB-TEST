// 24+ selectable characters with unique color schemes
// Each character has: name, hat color, skin, shirt, pants, shoes, highlight

export const CHARACTERS = [
  // Fantasy set
  { id: 'warrior', name: 'Warrior', hat: '#8b5e3c', hatDark: '#5c3a1e', shirt: '#4488cc', shirtDark: '#2255aa', pants: '#8b5e3c', shoes: '#5c3a1e', skin: '#ffcc99', hair: '#8b5e3c', weapon: '#aaaacc' },
  { id: 'astronaut', name: 'Astronaut', hat: '#ddddee', hatDark: '#aabbcc', shirt: '#ddddee', shirtDark: '#aabbcc', pants: '#ddddee', shoes: '#888899', skin: '#ffcc99', hair: '#555555', weapon: null },
  { id: 'mage', name: 'Mage', hat: '#7744aa', hatDark: '#553388', shirt: '#7744aa', shirtDark: '#553388', pants: '#444466', shoes: '#333344', skin: '#ddbbee', hair: '#44cc88', weapon: null },
  { id: 'ninja', name: 'Ninja', hat: '#222233', hatDark: '#111122', shirt: '#222233', shirtDark: '#111122', pants: '#222233', shoes: '#111122', skin: '#ffcc99', hair: '#222233', weapon: '#aaaacc' },
  { id: 'pirate', name: 'Pirate', hat: '#cc4444', hatDark: '#992222', shirt: '#cc8844', shirtDark: '#aa6622', pants: '#555577', shoes: '#443322', skin: '#eebb88', hair: '#aa5522', weapon: '#ccccaa' },
  { id: 'knight', name: 'Knight', hat: '#888899', hatDark: '#666677', shirt: '#888899', shirtDark: '#666677', pants: '#777788', shoes: '#555566', skin: '#ffcc99', hair: '#aa8844', weapon: '#aaaacc' },
  { id: 'ranger', name: 'Ranger', hat: '#44aa44', hatDark: '#228822', shirt: '#44aa44', shirtDark: '#228822', pants: '#8b5e3c', shoes: '#5c3a1e', skin: '#ffcc99', hair: '#bb7733', weapon: '#8b5e3c' },
  { id: 'alien', name: 'Alien', hat: null, hatDark: null, shirt: '#44cc44', shirtDark: '#228822', pants: '#44cc44', shoes: '#228822', skin: '#66ee66', hair: '#44cc44', weapon: null },

  // Tough set
  { id: 'zombie', name: 'Zombie', hat: null, hatDark: null, shirt: '#556644', shirtDark: '#334422', pants: '#554433', shoes: '#332211', skin: '#88aa77', hair: '#445533', weapon: null },
  { id: 'biker', name: 'Biker', hat: null, hatDark: null, shirt: '#222233', shirtDark: '#111122', pants: '#333344', shoes: '#222233', skin: '#eebb88', hair: '#222222', weapon: null },
  { id: 'pinkman', name: 'Pink Guy', hat: null, hatDark: null, shirt: '#dd44aa', shirtDark: '#aa2288', pants: '#44aa44', shoes: '#228822', skin: '#ffcc99', hair: '#5533aa', weapon: null },
  { id: 'roboguard', name: 'Robo Guard', hat: '#4455aa', hatDark: '#223388', shirt: '#4455aa', shirtDark: '#223388', pants: '#4455aa', shoes: '#334477', skin: '#8899bb', hair: '#4455aa', weapon: null },
  { id: 'wrestler', name: 'Wrestler', hat: null, hatDark: null, shirt: '#cc4444', shirtDark: '#992222', pants: '#cc4444', shoes: '#884422', skin: '#eebb88', hair: '#444444', weapon: null },
  { id: 'cowboy', name: 'Cowboy', hat: '#cc8844', hatDark: '#aa6622', shirt: '#ff8833', shirtDark: '#cc6622', pants: '#cc4444', shoes: '#884422', skin: '#eebb88', hair: '#884422', weapon: null },
  { id: 'swat', name: 'SWAT', hat: '#333344', hatDark: '#222233', shirt: '#333355', shirtDark: '#222244', pants: '#333355', shoes: '#222233', skin: '#ffcc99', hair: '#333344', weapon: '#555566' },
  { id: 'vampire', name: 'Vampire', hat: null, hatDark: null, shirt: '#443366', shirtDark: '#332255', pants: '#333344', shoes: '#222233', skin: '#bbaacc', hair: '#222244', weapon: null },

  // Job set
  { id: 'police', name: 'Police', hat: '#223366', hatDark: '#112244', shirt: '#223366', shirtDark: '#112244', pants: '#223366', shoes: '#111133', skin: '#ffcc99', hair: '#443322', weapon: null },
  { id: 'soccer', name: 'Soccer', hat: null, hatDark: null, shirt: '#cc4444', shirtDark: '#992222', pants: '#ffffff', shoes: '#222233', skin: '#ffcc99', hair: '#bb7733', weapon: null },
  { id: 'spaceman', name: 'Spaceman', hat: '#ccccdd', hatDark: '#aaaacc', shirt: '#ccccdd', shirtDark: '#aaaacc', pants: '#ccccdd', shoes: '#999aaa', skin: '#ffcc99', hair: '#555555', weapon: null },
  { id: 'cheerleader', name: 'Cheerleader', hat: null, hatDark: null, shirt: '#ff4444', shirtDark: '#cc2222', pants: '#ffffff', shoes: '#ff4444', skin: '#ffcc99', hair: '#ff8844', weapon: null },
  { id: 'firefighter', name: 'Firefighter', hat: '#cc4444', hatDark: '#992222', shirt: '#ffcc44', shirtDark: '#ddaa22', pants: '#333344', shoes: '#222233', skin: '#ffcc99', hair: '#443322', weapon: null },
  { id: 'soldier', name: 'Soldier', hat: '#446633', hatDark: '#334422', shirt: '#446633', shirtDark: '#334422', pants: '#446633', shoes: '#333322', skin: '#ffcc99', hair: '#443322', weapon: '#666655' },
  { id: 'princess', name: 'Princess', hat: '#ffaa88', hatDark: '#ee8866', shirt: '#ff88cc', shirtDark: '#dd66aa', pants: '#ff88cc', shoes: '#ffaacc', skin: '#ffddbb', hair: '#ffdd44', weapon: null },
  { id: 'doctor', name: 'Doctor', hat: null, hatDark: null, shirt: '#88ddee', shirtDark: '#66bbcc', pants: '#88ddee', shoes: '#ffffff', skin: '#ffcc99', hair: '#ff8844', weapon: null },
]

// Get character by ID
export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) || CHARACTERS[0]
}

// Get random character
export function getRandomCharacter() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
}
