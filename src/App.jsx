import React, { useState, useCallback, useRef } from 'react'
import GameScreen from './components/GameScreen.jsx'
import StartScreen from './components/StartScreen.jsx'
import GameOverScreen from './components/GameOverScreen.jsx'
import './styles.css'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [gameData, setGameData] = useState({
    score: 0,
    coins: 0,
    combo: 0,
    timeRatio: 1,
    highScore: 0,
    highCoins: 0,
  })
  const [gameKey, setGameKey] = useState(0)
  const gameOverTimerRef = useRef(null)

  const handleStart = useCallback(() => {
    // Clear any pending game over timer from previous game
    if (gameOverTimerRef.current) {
      clearTimeout(gameOverTimerRef.current)
      gameOverTimerRef.current = null
    }
    setScreen('playing')
    setGameKey(k => k + 1)
  }, [])

  const handleUpdate = useCallback((data) => {
    setGameData(data)
    if (data.gameState === 'gameover' && !gameOverTimerRef.current) {
      gameOverTimerRef.current = setTimeout(() => {
        setScreen('gameover')
      }, 800)
    }
  }, [])

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {(screen === 'playing' || (screen === 'gameover')) && (
        <GameScreen
          key={gameKey}
          onUpdate={handleUpdate}
          autoStart={true}
        />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          score={gameData.score}
          coins={gameData.coins}
          highScore={gameData.highScore}
          highCoins={gameData.highCoins}
          combo={gameData.combo}
          onRestart={handleStart}
          onMenu={() => setScreen('start')}
        />
      )}
    </div>
  )
}
