import React, { useState, useEffect } from 'react';
import { LearnMoreButton } from '../common/LearnMoreButtonGames';
import {
  playBlackJack,
  handlePlayerHit,
  handleDealerTurn,
  GameState,
  Card
} from './BlackJackTS';

const BlackjackTable: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerCards: [],
    dealerCards: [],
    playerValue: 0,
    dealerValue: 0,
    gameStatus: '',
    isGameOver: false,
    deck_id: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [playerBalance, setPlayerBalance] = useState<number>(1000);

  const initializeGame = async () => {
    setLoading(true);
    try {
      const newGameState = await playBlackJack();
      setGameState(newGameState);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHit = async () => {
    if (gameState.isGameOver) return;
    
    setLoading(true);
    try {
      const newState = await handlePlayerHit(gameState);
      setGameState(newState);
    } catch (error) {
      console.error('Error hitting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStand = async () => {
    if (gameState.isGameOver) return;
    
    setLoading(true);
    try {
      const newState = await handleDealerTurn(gameState);
      setGameState(newState);
      
      // Handle winnings
      if (newState.gameStatus.includes('Player wins')) {
        setPlayerBalance(prev => prev + betAmount * 2);
      } else if (newState.gameStatus.includes('tie')) {
        setPlayerBalance(prev => prev + betAmount);
      }
    } catch (error) {
      console.error('Error standing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBet = () => {
    if (betAmount <= playerBalance) {
      setPlayerBalance(prev => prev - betAmount);
      setGameState(prev => ({
        ...prev,
        gameStatus: "Player's turn"
      }));
    }
  };

  const handleNewGame = () => {
    initializeGame();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const CardComponent: React.FC<{ card: Card; hidden?: boolean }> = ({ card, hidden }) => (
    <div className="w-24 h-36 bg-white rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden">
      {!hidden ? (
        <div className="flex flex-col items-center">
          <span className={`text-2xl ${card.suit === 'HEARTS' || card.suit === 'DIAMONDS' ? 'text-red-600' : 'text-black'}`}>
            {card.value}
          </span>
          <span className="text-sm mt-1">{card.suit}</span>
        </div>
      ) : (
        <div className="absolute inset-0 bg-blue-800 pattern-grid-white" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-green-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Blackjack</h1>
            <p className="text-lg">Balance: ${playerBalance}</p>
          </div>
          <LearnMoreButton gameType="blackjack" />
        </div>

        {/* Dealer's Cards */}
        <div className="bg-green-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Dealer's Hand {gameState.isGameOver ? `(${gameState.dealerValue})` : ''}
          </h2>
          <div className="flex gap-4 flex-wrap">
            {gameState.dealerCards.map((card: Card, index) => (
              <CardComponent 
                key={index} 
                card={card} 
                hidden={!gameState.isGameOver && index !== 0}
              />
            ))}
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {loading ? 'Processing...' : gameState.gameStatus}
          </h2>
          {betAmount > 0 && (
            <p className="text-white mt-2">Current Bet: ${betAmount}</p>
          )}
        </div>

        {/* Player's Cards */}
        <div className="bg-green-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Your Hand ({gameState.playerValue})
          </h2>
          <div className="flex gap-4 flex-wrap">
            {gameState.playerCards.map((card, index) => (
              <CardComponent key={index} card={card} />
            ))}
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex flex-col items-center gap-4">
          {gameState.gameStatus === "Place your bet" ? (
            <div className="flex gap-4 items-center">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(0, Number(e.target.value)))}
                className="w-24 px-3 py-2 rounded border"
                min="1"
                max={playerBalance}
              />
              <button
                onClick={handleBet}
                disabled={loading || betAmount > playerBalance}
                className="px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 disabled:opacity-50"
              >
                Place Bet
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={handleHit}
                disabled={loading || gameState.isGameOver}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 disabled:opacity-50"
              >
                Hit
              </button>
              <button
                onClick={handleStand}
                disabled={loading || gameState.isGameOver}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-400 disabled:opacity-50"
              >
                Stand
              </button>
            </div>
          )}
          
          {gameState.isGameOver && (
            <button
              onClick={handleNewGame}
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-400 disabled:opacity-50"
            >
              New Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlackjackTable;