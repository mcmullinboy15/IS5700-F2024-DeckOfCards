import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';




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
    <Box sx={{bgcolor:"#a5d9ff", display:"flex", flexDirection:"row", justifyContent:"center"}}>
    <div className="game-card">
      <Box sx={{display:"flex", justifyContent:"center"}}>
      <Typography  variant='h5'>{game.name}</Typography>

      </Box>
        <Box gap={2}>
      <div className="game-actions">
        {game.actions.map((action) => (
          
          <Button
          variant='outlined'
            key={action}
            onClick={() => onClickAction(game.name, action)}
            className="game-action-button"
            >
            {action}
          </Button>
        ))}
      </div>
      <Box sx={{display:"flex", justifyContent:"center"}}>

      <Button variant='contained' onClick={() => handleNavToLobby(game.name)}>Enter Lobby</Button>
      </Box>
        </Box>
    </div>
    </Box>
  );
};

export default GameCard;
