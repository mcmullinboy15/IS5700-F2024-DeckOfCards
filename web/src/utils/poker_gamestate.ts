import {GameState, GamePhase, PlayerAction} from './pokerLogic';

//types for MQTT message
interface MQTTGameState {
    gameId: string;
    phase: GamePhase;
    communityCards: PublicCard[];
    pot: number;
    currentBet: number;
    minRaise: number;
    activePlayer: number;
    dealerPosition: number;
    players: PublicPlayerState[];
    lastAction?: {
      playerId: number;
      action: PlayerAction;
      amount?: number;
    };
  }
  
  interface PublicCard {
    displayValue: string;
    displaySuit: string;
  }
  
  interface PublicPlayerState {
    id: number;
    chips: number;
    bet: number;
    folded: boolean;
    acted: boolean;
    isDealer: boolean;
    isSmallBlind: boolean;
    isBigBlind: boolean;
    allIn: boolean;
    cards?: PublicCard[];
  }
  
  //MQTT message
  function MQTTMessage(gameState: GameState, playerId?: number): MQTTGameState {
    const mqtt: MQTTGameState = {
      gameId: crypto.randomUUID(),
      phase: gameState.phase,
      communityCards: gameState.communityCards.map(card => ({
        displayValue: card.displayValue,
        displaySuit: card.displaySuit
      })),
      pot: gameState.pots.reduce((sum, pot) => sum + pot.amount, 0),
      currentBet: gameState.currentBet,
      minRaise: gameState.minRaise,
      activePlayer: gameState.activePlayer,
      dealerPosition: gameState.dealerPosition,
      players: gameState.players.map(player => ({
        id: player.id,
        chips: player.chips,
        bet: player.bet,
        folded: player.folded,
        acted: player.acted,
        isDealer: player.isDealer,
        isSmallBlind: player.isSmallBlind,
        isBigBlind: player.isBigBlind,
        allIn: player.allIn,
        //send cards for the requesting player or during showdown
        cards: (playerId === player.id || gameState.phase === 'showdown') 
          ? player.cards.map(card => ({
              displayValue: card.displayValue,
              displaySuit: card.displaySuit
            }))
          : undefined
      }))
    };
    
    return mqtt;
  }