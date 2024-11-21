import  {BaseGameState, BasePlayerState} from './roulette.jsx';

export type RouletteBetType = 'single' | 'split' | 'corner' | 'column' | 'low' | 'high' | 'red' | 'black' | 'even' | 'odd';
export type RoulettePhase = 'betting' | 'spinning' | 'payout';

interface RouletteBet {
  type: RouletteBetType;
  numbers: number[];
  amount: number;
}

interface RoulettePlayer extends BasePlayerState {
  bets: RouletteBet[];
}

interface RouletteGameState extends BaseGameState {
  gameId: string,  
  gameType: 'roulette';
  phase: RoulettePhase;
  lastResult?: number;
  spinStartTime?: number;
  players: RoulettePlayer[];
  minBet: number;
  maxBet: number;
  timePerRound: number;
}

export function RouletteState(
  gameId: string,
  players: RoulettePlayer[],
  minBet = 1,
  maxBet = 1000,
  timePerRound = 30000
): RouletteGameState {
  return {
    gameId,
    gameType: 'roulette',
    phase: 'betting',
    players,
    minBet,
    maxBet,
    timePerRound
  };
}

export type {RouletteGameState, RoulettePlayer, RouletteBet};