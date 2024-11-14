// LearnMoreButton.tsx
import React from 'react';
import { InfoIcon } from 'lucide-react';

type GameType = 'blackjack' | 'roulette';

interface LearnMoreButtonProps {
  gameType?: GameType;
}

const LearnMoreButton: React.FC<LearnMoreButtonProps> = ({ gameType = 'blackjack' }) => {
  const rules = {
    blackjack: {
      title: 'How to Play Blackjack',
      rules: [
        'Beat the dealer by getting close to 21 without going over',
        'Number cards (2-10): Face value',
        'Face cards (J, Q, K): 10 points',
        'Ace: 1 or 11 points',
        'Hit to take another card, Stand to keep your hand',
        'Dealer must hit on 16 or below, stand on 17 or above'
      ]
    },
    roulette: {
      title: 'How to Play Roulette',
      rules: [
        'Bet on where the ball will land on the wheel',
        'Inside Bets: Single numbers (35:1)',
        'Outside Bets: Red/Black, Odd/Even (1:1)',
        'Dozens: 1-12, 13-24, or 25-36 (2:1)'
      ]
    }
  };

  const showRules = () => {
    alert(`${rules[gameType].title}\n\n${rules[gameType].rules.join('\n• ')}`);
  };

  return (
    <button 
      onClick={showRules} 
      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-100 border border-gray-200"
    >
      <InfoIcon className="w-4 h-4" />
      Learn More
    </button>
  );
};

export default LearnMoreButton;