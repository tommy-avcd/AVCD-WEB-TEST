import React, { useState, useCallback, useRef } from 'react'
import GameScreen from './components/GameScreen.jsx'
import StartScreen from './components/StartScreen.jsx'
import CharSelectScreen from './components/CharSelectScreen.jsx'
import ElevatorScreen from './components/ElevatorScreen.jsx'
import GameOverScreen from './components/GameOverScreen.jsx'
import './styles.css'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [gameData, setGameData] = useState({
    score: 0, coins: 0, combo: 0,
    gameState: 'playing',
    highScore: 0, highCoins: 0,
  })
  const [gameKey, setGameKey] = useState(0)
  const [playerChar, setPlayerChar] = useState(null)
  const [startFloor, setStartFloor] = useState(0)
  const gameOverTimerRef = useRef(null)

  const handleStart = useCallback(() => {
    setScreen('select')
  }, [])

  const handleCharSelect = useCallback((char) => {
    setPlayerChar(char)
    setScreen('elevator')
  }, [])

  const handleElevatorComplete = useCallback((floor) => {
    setStartFloor(floor)
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

  const handleRestart = useCallback(() => {
    if (gameOverTimerRef.current) {
      clearTimeout(gameOverTimerRef.current)
      gameOverTimerRef.current = null
    }
    setScreen('playing')
    setGameKey(k => k + 1)
  }, [])

  const handleMenu = useCallback(() => {
    if (gameOverTimerRef.current) {
      clearTimeout(gameOverTimerRef.current)
      gameOverTimerRef.current = null
    }
    setScreen('start')
  }, [])

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen onStart={handleStart} />
      )}
      {screen === 'select' && (
        <CharSelectScreen onSelect={handleCharSelect} />
      )}
      {screen === 'elevator' && (
        <ElevatorScreen onComplete={handleElevatorComplete} />
      )}
      {(screen === 'playing' || screen === 'gameover') && (
        <GameScreen
          key={gameKey}
          onUpdate={handleUpdate}
          autoStart={true}
          playerChar={playerChar}
          startFloor={startFloor}
        />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          score={gameData.score}
          coins={gameData.coins}
          highScore={gameData.highScore}
          highCoins={gameData.highCoins}
          combo={gameData.combo}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  )
}
