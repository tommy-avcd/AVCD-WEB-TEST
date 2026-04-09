import React, { useEffect, useState } from 'react'

export default function MatchScreen({ playerChar, aiChar, onReady }) {
  const [show, setShow] = useState(false)
  const [showVs, setShowVs] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100)
    const t2 = setTimeout(() => setShowVs(true), 600)
    const t3 = setTimeout(() => onReady(), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onReady])

  return (
    <div className={`match-screen ${show ? 'show' : ''}`}>
      <div className="match-content">
        {/* Player side */}
        <div className="match-player match-left">
          <div className="match-avatar" style={{ background: playerChar.shirt }}>
            <div className="char-head-lg" style={{ background: playerChar.skin }}>
              {playerChar.hat && <div className="char-hat-lg" style={{ background: playerChar.hat }} />}
            </div>
            <div className="char-body-lg" style={{ background: playerChar.shirt }}>
              <div className="char-pants-lg" style={{ background: playerChar.pants }} />
            </div>
          </div>
          <span className="match-name">YOU</span>
          <span className="match-charname">{playerChar.name}</span>
        </div>

        {/* VS */}
        <div className={`match-vs ${showVs ? 'show' : ''}`}>VS</div>

        {/* AI side */}
        <div className="match-player match-right">
          <div className="match-avatar" style={{ background: aiChar.shirt }}>
            <div className="char-head-lg" style={{ background: aiChar.skin }}>
              {aiChar.hat && <div className="char-hat-lg" style={{ background: aiChar.hat }} />}
            </div>
            <div className="char-body-lg" style={{ background: aiChar.shirt }}>
              <div className="char-pants-lg" style={{ background: aiChar.pants }} />
            </div>
          </div>
          <span className="match-name">CPU</span>
          <span className="match-charname">{aiChar.name}</span>
        </div>
      </div>
    </div>
  )
}
