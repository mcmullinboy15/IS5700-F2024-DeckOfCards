import React, { useState } from 'react';
import './roulette.css'; // We'll create this CSS file

const RouletteGame = () => {
  const [balance, setBalance] = useState(1000);
  const [balanceInput, setBalanceInput] = useState('1000');
  const [currentBet, setCurrentBet] = useState(0);
  const [selectedBets, setSelectedBets] = useState([]);
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const numbers = Array.from({ length: 37 }, (_, i) => i);
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const isRed = (num) => redNumbers.includes(num);
  
  const betTypes = {
    SINGLE: 'single',
    SPLIT: 'split',
    CORNER: 'corner',
    COLUMN: 'column',
    LOW: 'low',
    HIGH: 'high',
    RED: 'red',
    BLACK: 'black',
    EVEN: 'even',
    ODD: 'odd'
  };

  const payouts = {
    [betTypes.SINGLE]: 35,
    [betTypes.SPLIT]: 17,
    [betTypes.CORNER]: 8,
    [betTypes.COLUMN]: 2,
    [betTypes.LOW]: 1,
    [betTypes.HIGH]: 1,
    [betTypes.RED]: 1,
    [betTypes.BLACK]: 1,
    [betTypes.EVEN]: 1,
    [betTypes.ODD]: 1
  };

  const handleBalanceChange = (e) => {
    const value = e.target.value;
    setBalanceInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setBalance(numValue);
    }
  };

  const placeBet = (type, numbers, amount = currentBet) => {
    if (amount <= 0) return;
    if (balance < amount) return;
    
    setSelectedBets([...selectedBets, { type, numbers, amount }]);
    setBalance(prev => prev - amount);
    setBalanceInput((prev => (parseInt(prev) - amount).toString()));
  };

  const spin = () => {
    if (selectedBets.length === 0) return;
    
    setSpinning(true);
    const winningNumber = Math.floor(Math.random() * 37);
    
    setTimeout(() => {
      setResult(winningNumber);
      calculateWinnings(winningNumber);
      setSpinning(false);
      setSelectedBets([]);
    }, 2000);
  };

  const calculateWinnings = (winningNumber) => {
    let winnings = 0;
    
    selectedBets.forEach(bet => {
      if (bet.numbers.includes(winningNumber)) {
        winnings += bet.amount * (payouts[bet.type] + 1);
      }
    });
    
    setBalance(prev => prev + winnings);
    setBalanceInput(prev => (parseInt(prev) + winnings).toString());
  };

  const isNumberWinning = (number) => {
    if (!result) return false;
    return number === result;
  };

  return (
    <div className="roulette-container">
      <div className="roulette-table">
        {/* Header Section */}
        <div className="header-section">
          <div className="balance-container">
            <div className="label">Current Balance</div>
            <input 
              type="number"
              value={balanceInput}
              onChange={handleBalanceChange}
              disabled={spinning}
              className="balance-input"
              min="0"
            />
          </div>
          <div className="bet-container">
            <div className="label">Place Your Bet</div>
            <input 
              type="number" 
              value={currentBet}
              onChange={(e) => setCurrentBet(Number(e.target.value))}
              className="bet-input"
              placeholder="Bet amount"
              min="0"
            />
          </div>
        </div>

        {/* Main Roulette Table */}
        <div className="main-table">
          {/* Zero */}
          <div className="number-grid">
            <button
              className="zero-button"
              onClick={() => placeBet(betTypes.SINGLE, [0])}
            >
              0
            </button>
            
            {/* Numbers Grid 1-36 */}
            <div className="numbers-container">
              {numbers.slice(1).map(num => (
                <button
                  key={num}
                  onClick={() => placeBet(betTypes.SINGLE, [num])}
                  className={`number-button ${isRed(num) ? 'red' : 'black'} ${isNumberWinning(num) ? 'winning' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Outside Bets */}
          <div className="outside-bets">
            <div className="bet-column">
              <button 
                onClick={() => placeBet(betTypes.RED, redNumbers)}
                className="outside-button red-button"
              >
                Red
              </button>
              <button 
                onClick={() => placeBet(betTypes.ODD, numbers.filter(n => n % 2 === 1))}
                className="outside-button odd-even-button"
              >
                Odd
              </button>
            </div>
            
            <div className="bet-column">
              <button 
                onClick={() => placeBet(betTypes.BLACK, numbers.filter(n => n !== 0 && !redNumbers.includes(n)))}
                className="outside-button black-button"
              >
                Black
              </button>
              <button 
                onClick={() => placeBet(betTypes.EVEN, numbers.filter(n => n !== 0 && n % 2 === 0))}
                className="outside-button odd-even-button"
              >
                Even
              </button>
            </div>
            
            <div className="bet-column">
              <button 
                onClick={() => placeBet(betTypes.LOW, numbers.filter(n => n >= 1 && n <= 18))}
                className="outside-button range-button"
              >
                1-18
              </button>
              <button 
                onClick={() => placeBet(betTypes.HIGH, numbers.filter(n => n >= 19 && n <= 36))}
                className="outside-button range-button"
              >
                19-36
              </button>
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <button 
          onClick={spin}
          disabled={spinning || selectedBets.length === 0}
          className={`spin-button ${spinning ? 'spinning' : ''}`}
        >
          {spinning ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              Spinning...
            </div>
          ) : 'SPIN'}
        </button>

        {/* Current Result */}
        {result !== null && (
          <div className="result-container">
            <div className="label">Last Spin</div>
            <div className="result">
              {result}
              {result > 0 && (
                <span className={isRed(result) ? 'red-text' : 'black-text'}>
                  {isRed(result) ? ' (Red)' : ' (Black)'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;