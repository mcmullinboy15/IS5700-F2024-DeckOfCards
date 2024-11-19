import React, { useState } from 'react';
import { initGame, handleAction, type GameState } from '../utils/pokerLogic';
import { Player } from '../utils/pokerLogic';

const MainPokerTable = () => {
  const [gameState, setGameState] = useState<GameState>(initGame(6));
  const [error, setError] = useState<string>('');

  const handlePlayerAction = (action: "fold" | "check" | "call" | "raise", amount?: number) => {
    try {
      const newState = handleAction(gameState, gameState.activePlayer, action, amount);
      setGameState(newState);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="relative w-[800px] h-[800px] bg-green-700 rounded-full flex items-center justify-center">
      <div className="absolute inset-1/4 bg-green-800 rounded-full flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">
          Community Cards: {gameState.communityCards.length}
        </div>
        
        <div className="text-white text-xl">
          Pot: {gameState.pots.reduce((sum, pot) => sum + pot.amount, 0)}
        </div>
        
        {error && (
          <div className="text-red-300 mt-2">{error}</div>
        )}
      </div>

      {/* Players */}
      {gameState.players.map((player: Player, i) => {
        const angle = (i * 360) / gameState.players.length - 90; //tart from top
        const radius = 200; //based on your table size
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        return (
          <div
            key={player.id}
            className="absolute"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            <div className={`p-4 rounded-lg ${gameState.activePlayer === player.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <div className="text-sm">
                Player {player.id + 1}
                {player.isDealer && ' (D)'}
                {player.isSmallBlind && ' (SB)'}
                {player.isBigBlind && ' (BB)'}
              </div>
              <div>Chips: {player.chips}</div>
              <div>Cards: {player.cards.length}</div>
              {player.folded && <div className="text-red-500">FOLDED</div>}
              
              {gameState.activePlayer === player.id && !player.folded && (
                <div className="mt-2">
                  <button 
                    onClick={() => handlePlayerAction('fold')}
                    className="px-2 py-1 bg-red-500 text-white rounded mr-2"
                  >
                    Fold
                  </button>
                  <button 
                    onClick={() => handlePlayerAction('call')}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Call
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      <div className="absolute top-4 left-4 text-white">
        Phase: {gameState.phase}
      </div>
      <div className="absolute top-4 right-4 text-white">
        Current Bet: {gameState.currentBet}
      </div>
    </div>
  );
};

export default MainPokerTable;