import { useNavigate } from 'react-router-dom';

interface GameCardProps {
  game: {
    id: number;
    name: string;
    actions: string[];
  };
  onClickAction: (gameType: string, action: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClickAction }) => {
  const navigate = useNavigate();
  const handleNavToLobby = (gameType: string) => {
    navigate(`/lobby/${gameType}`);
  }

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
      <button onClick={() => handleNavToLobby(game.name)}>Enter Lobby</button>
    </div>
  );
};

export default GameCard;
