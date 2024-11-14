type TimeoutAction = "fold" | "check" | "stand" | "forfeit";
type GameType = "poker" | "blackjack" | "roulette";

interface TimerConfig {
  turnDuration: number;
  gameType: GameType;
  warningTime: number;
  defaultAction: TimeoutAction;
}

interface TimerState {
  isActive: boolean;
  startTime: number;
  currentPlayerId: number;
  timeRemaining: number;
  warningIssued: boolean;
}

class TurnTimer {
  private config: TimerConfig;
  private state: TimerState;
  private timeoutId: number | null = null;
  private warningTimeoutId: number | null = null;

  constructor(config: TimerConfig) {
    this.config = {
      turnDuration: config.turnDuration,
      gameType: config.gameType,
      warningTime: config.warningTime,
      defaultAction: config.defaultAction,
    };

    this.state = {
      isActive: false,
      startTime: 0,
      currentPlayerId: -1,
      timeRemaining: config.turnDuration,
      warningIssued: false,
    };
  }

  startTurn(
    playerId: number,
    onTimeout: () => void,
    onWarning?: () => void
  ): void {
    this.clearTimers();

    this.state = {
      isActive: true,
      startTime: Date.now(),
      currentPlayerId: playerId,
      timeRemaining: this.config.turnDuration,
      warningIssued: false,
    };

    if (onWarning) {
      this.warningTimeoutId = window.setTimeout(() => {
        this.state.warningIssued = true;
        onWarning();
      }, this.config.turnDuration - this.config.warningTime);
    }

    this.timeoutId = window.setTimeout(() => {
      this.endTurn();
      onTimeout();
    }, this.config.turnDuration);
  }

  endTurn(): void {
    this.clearTimers();
    this.state.isActive = false;
  }

  getRemainingTime(): number {
    if (!this.state.isActive) return 0;
    return Math.max(
      0,
      this.config.turnDuration - (Date.now() - this.state.startTime)
    );
  }

  isActive(): boolean {
    return this.state.isActive;
  }

  getCurrentPlayer(): number {
    return this.state.currentPlayerId;
  }

  private clearTimers(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId !== null) {
      window.clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }
}

const DEFAULT_CONFIGS: Record<GameType, TimerConfig> = {
  poker: {
    turnDuration: 30000, // 30 seconds
    gameType: "poker",
    warningTime: 10000, // 10 second warning
    defaultAction: "fold",
  },
  blackjack: {
    turnDuration: 20000, // 20 seconds
    gameType: "blackjack",
    warningTime: 10000, // 10 second warning
    defaultAction: "stand",
  },
  roulette: {
    turnDuration: 20000, // 20 seconds
    gameType: "roulette",
    warningTime: 10000, // 10 second warning
    defaultAction: "forfeit",
  },
};

function getPokerTimeoutAction(
  currentBet: number,
  playerBet: number
): TimeoutAction {
  return currentBet > playerBet ? "fold" : "check";
}

export { TurnTimer, DEFAULT_CONFIGS, getPokerTimeoutAction };
export type { TimerConfig, TimeoutAction, GameType };

/* they are used like this..:

// import..

// poker:
const pokerTimer = new TurnTimer(DEFAULT_CONFIGS.poker);
pokerTimer.startTurn(
  playerId,
  () => {
    const timeoutAction = getPokerTimeoutAction(gameState.currentBet, gameState.players[playerId].bet);
    handleAction(gameState, playerId, timeoutAction);
  },
  () => notifyPlayer(playerId, "10 seconds remaining!")
);

// blackjack:
const blackjackTimer = new TurnTimer(DEFAULT_CONFIGS.blackjack);
blackjackTimer.startTurn(
  playerId,
  () => handleAction(gameState, playerId, "stand"),
  () => notifyPlayer(playerId, "10 seconds remaining!")
);

// roulette:
const rouletteTimer = new TurnTimer(DEFAULT_CONFIGS.roulette);
rouletteTimer.startTurn(
  playerId,
  () => finalizeBets(gameState, playerId),
  () => notifyPlayer(playerId, "10 seconds remaining!")
);
*/
