import React, { useState, useCallback, useRef } from 'react'
import GameScreen from './components/GameScreen.jsx'
import StartScreen from './components/StartScreen.jsx'
import CharSelectScreen from './components/CharSelectScreen.jsx'
import MatchScreen from './components/MatchScreen.jsx'
import ElevatorScreen from './components/ElevatorScreen.jsx'
import ResultScreen from './components/ResultScreen.jsx'
import { getRandomCharacter } from './game/Characters.js'
import './styles.css'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [gameData, setGameData] = useState({
    score: 0, coins: 0, combo: 0,
    aiScore: 0, gameState: 'playing',
    highScore: 0, highCoins: 0,
  })
  const [gameKey, setGameKey] = useState(0)
  const [playerChar, setPlayerChar] = useState(null)
  const [aiChar, setAiChar] = useState(null)
  const [startFloor, setStartFloor] = useState(0)
  const gameOverTimerRef = useRef(null)

  const handleStart = useCallback(() => {
    setScreen('select')
  }, [])

  const handleCharSelect = useCallback((char) => {
    setPlayerChar(char)
    setAiChar(getRandomCharacter())
    setScreen('elevator')
  }, [])

  const handleElevatorComplete = useCallback((floor) => {
    setStartFloor(floor)
    setScreen('match')
  }, [])

  const handleMatchReady = useCallback(() => {
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
        setScreen('result')
      }, 1000)
    }
  }, [])

  const handleRestart = useCallback(() => {
    if (gameOverTimerRef.current) {
      clearTimeout(gameOverTimerRef.current)
      gameOverTimerRef.current = null
    }
    setAiChar(getRandomCharacter())
    setScreen('match')
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
      {screen === 'match' && playerChar && aiChar && (
        <MatchScreen
          playerChar={playerChar}
          aiChar={aiChar}
          onReady={handleMatchReady}
        />
      )}
      {(screen === 'playing' || screen === 'result') && (
        <GameScreen
          key={gameKey}
          onUpdate={handleUpdate}
          autoStart={true}
          playerChar={playerChar}
          aiChar={aiChar}
          startFloor={startFloor}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          won={gameData.score > gameData.aiScore}
          playerScore={gameData.score}
          aiScore={gameData.aiScore}
          playerChar={playerChar}
          aiChar={aiChar}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}
    </div>
  )
}
