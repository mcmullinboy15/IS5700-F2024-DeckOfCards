import React, { useState, useEffect, useCallback } from "react";
import {
  initGame,
  handleAction,
  GameState,
  Player,
  Card,
  Pot,
} from "../game-logic/poker-logic";

// utility to join class names
const cn = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// badge component
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// avatar components
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Avatar: React.FC<AvatarProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage: React.FC<AvatarImageProps> = ({ className, ...props }) => {
  return (
    <img className={cn("aspect-square h-full w-full", className)} {...props} />
  );
};

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gray-400 text-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "success" | "error";
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
    success: "bg-green-500 text-white hover:bg-green-600",
    error: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// player positions
const PLAYER_POSITIONS = [
  { top: "75%", left: "50%" },
  { top: "60%", left: "80%" },
  { top: "25%", left: "80%" },
  { top: "10%", left: "50%" },
  { top: "25%", left: "20%" },
  { top: "60%", left: "20%" },
];

const PokerRoom: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initGame(6));
  const [raiseAmount, setRaiseAmount] = useState<number>(gameState.bigBlind);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  // set current player
  useEffect(() => {
    const player = gameState.players.find((p) => p.id === 0);
    setCurrentPlayer(player || null);
  }, [gameState]);

  // handle actions
  const handlePlayerAction = useCallback(
    (action: "fold" | "check" | "call" | "raise") => {
      if (!currentPlayer) return;
      if (gameState.activePlayer !== currentPlayer.id) return;

      let newGameState: GameState;
      try {
        if (action === "raise") {
          newGameState = handleAction(
            gameState,
            currentPlayer.id,
            action,
            raiseAmount
          );
        } else {
          newGameState = handleAction(gameState, currentPlayer.id, action);
        }
        setGameState(newGameState);
      } catch (error) {
        console.error(error);
      }
    },
    [gameState, currentPlayer, raiseAmount]
  );

  // display a card
  const renderCard = (card: Card, idx: number) => (
    <div
      key={idx}
      className={`w-10 h-14 rounded-md flex items-center justify-center text-lg font-bold ${
        card.displaySuit === "hearts" || card.displaySuit === "diamonds"
          ? "text-red-500"
          : "text-black"
      } bg-white border-2 border-gray-300`}
    >
      {card.displayValue}
    </div>
  );

  // display a player
  const renderPlayer = (player: Player, index: number) => (
    <div
      key={player.id}
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2",
        player.id === gameState.activePlayer
          ? "ring-4 ring-blue-300 rounded-full"
          : ""
      )}
      style={{
        top: PLAYER_POSITIONS[index].top,
        left: PLAYER_POSITIONS[index].left,
      }}
    >
      <Avatar>
        {player.id === 0 ? (
          <>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=player${player.id}`}
              alt={`Player ${player.id}`}
            />
            <AvatarFallback>You</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage
              src={`https://api.dicebear.com/6.x/avataaars/svg?seed=player${player.id}`}
              alt={`Player ${player.id}`}
            />
            <AvatarFallback>P{player.id}</AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="mt-2 text-center">
        <Badge variant={player.folded ? "secondary" : "default"}>
          ${player.chips}
        </Badge>
        {player.bet > 0 && (
          <Badge variant="outline" className="ml-2">
            Bet: ${player.bet}
          </Badge>
        )}
      </div>
      {player.id === 0 && (
        <div className="flex mt-2 space-x-1">
          {player.cards.map((card: Card, idx: number) => renderCard(card, idx))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-green-800 overflow-hidden">
      {/* game table */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-green-700 rounded-full border-8 border-yellow-600">
        {/* players */}
        {gameState.players.map((player: Player, index: number) =>
          renderPlayer(player, index)
        )}

        {/* community cards */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-2">
          {gameState.communityCards.map((card: Card, index: number) =>
            renderCard(card, index)
          )}
        </div>

        {/* action buttons */}
        {currentPlayer && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <Button
              onClick={() => handlePlayerAction("fold")}
              variant="error"
              disabled={
                gameState.activePlayer !== currentPlayer.id ||
                currentPlayer.folded ||
                currentPlayer.allIn
              }
            >
              Fold
            </Button>
            <Button
              onClick={() => handlePlayerAction("check")}
              variant="default"
              disabled={
                gameState.activePlayer !== currentPlayer.id ||
                gameState.currentBet > currentPlayer.bet ||
                currentPlayer.folded ||
                currentPlayer.allIn
              }
            >
              Check
            </Button>
            <Button
              onClick={() => handlePlayerAction("call")}
              variant="default"
              disabled={
                gameState.activePlayer !== currentPlayer.id ||
                gameState.currentBet === currentPlayer.bet ||
                currentPlayer.folded ||
                currentPlayer.allIn ||
                currentPlayer.chips === 0
              }
            >
              Call ${gameState.currentBet - currentPlayer.bet}
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePlayerAction("raise")}
                variant="success"
                disabled={
                  gameState.activePlayer !== currentPlayer.id ||
                  raiseAmount < gameState.minRaise ||
                  raiseAmount > currentPlayer.chips ||
                  currentPlayer.folded ||
                  currentPlayer.allIn
                }
              >
                Raise
              </Button>
              <input
                type="number"
                value={raiseAmount}
                onChange={(e) =>
                  setRaiseAmount(
                    Math.max(
                      gameState.bigBlind,
                      parseInt(e.target.value) || gameState.bigBlind
                    )
                  )
                }
                className="w-20 px-2 py-1 text-black rounded"
                min={gameState.bigBlind}
                step={gameState.bigBlind}
              />
            </div>
          </div>
        )}
      </div>

      {/* game info */}
      <div className="absolute top-4 left-4 text-white">
        <p>
          Pot: $
          {gameState.pots.reduce(
            (sum: number, pot: Pot) => sum + pot.amount,
            0
          )}
        </p>
        <p>Phase: {gameState.phase}</p>
        <p>Current Bet: ${gameState.currentBet}</p>
      </div>
    </div>
  );
};

export default PokerRoom;
