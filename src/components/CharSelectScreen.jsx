import React, { useState } from 'react'
import { CHARACTERS } from '../game/Characters.js'

export default function CharSelectScreen({ onSelect }) {
  const [selected, setSelected] = useState(null)

  const handleConfirm = () => {
    if (selected) onSelect(selected)
  }

  return (
    <div className="charselect-screen">
      <h2 className="charselect-title">SELECT CHARACTER</h2>
      <div className="charselect-grid">
        {CHARACTERS.map((char) => (
          <div
            key={char.id}
            className={`charselect-item ${selected?.id === char.id ? 'selected' : ''}`}
            onClick={() => setSelected(char)}
            onTouchStart={(e) => { e.preventDefault(); setSelected(char) }}
          >
            <div className="charselect-avatar" style={{ background: char.shirt }}>
              <div className="char-head" style={{ background: char.skin }}>
                {char.hat && <div className="char-hat" style={{ background: char.hat }} />}
              </div>
              <div className="char-body" style={{ background: char.shirt }}>
                <div className="char-pants" style={{ background: char.pants }} />
              </div>
            </div>
            <span className="charselect-name">{char.name}</span>
          </div>
        ))}
      </div>
      {selected && (
        <div className="charselect-confirm">
          <div className="charselect-preview">
            <div className="preview-avatar-large" style={{ background: selected.shirt }}>
              <div className="char-head-lg" style={{ background: selected.skin }}>
                {selected.hat && <div className="char-hat-lg" style={{ background: selected.hat }} />}
              </div>
              <div className="char-body-lg" style={{ background: selected.shirt }}>
                <div className="char-pants-lg" style={{ background: selected.pants }} />
                <div className="char-shoes-lg" style={{ background: selected.shoes }} />
              </div>
            </div>
            <span className="preview-name">{selected.name}</span>
          </div>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            onTouchStart={(e) => { e.preventDefault(); handleConfirm() }}
          >
            FIGHT!
          </button>
        </div>
      )}
    </div>
  )
}
