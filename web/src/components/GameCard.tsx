interface GameCardProps {
  game: {
    id: number;
    name: string;
    actions: string[];
  };
  onClickAction: (gameName: string, action: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClickAction }) => {
  return (
    <div className="game-card">
      <h2>{game.name}</h2>
      <div className="game-actions">
        {game.actions.map((action) => (
          <button
            key={action}
            onClick={() => onClickAction(game.name, action)}
            className="game-action-button"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameCard;
