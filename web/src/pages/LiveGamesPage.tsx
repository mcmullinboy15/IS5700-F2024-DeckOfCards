import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface LiveGame {
  lobbyNumber: number;
  gameType: string;
  playerCount: number;
}

const LiveGamesPage = () => {
  const navigate = useNavigate();

  const liveGames: LiveGame[] = [
    { lobbyNumber: 1, gameType: "poker", playerCount: 6 },
    { lobbyNumber: 2, gameType: "blackjack", playerCount: 3 },
    { lobbyNumber: 3, gameType: "roulette", playerCount: 4 },
  ];

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Live Games
      </Typography>

      <Box
        sx={{
          display: "grid",
          width: 300,
          gap: 3,
        }}
      >
        {liveGames.map((game) => (
          <Card key={game.lobbyNumber}>
            <CardContent>
              <Typography variant="h6">Lobby #{game.lobbyNumber}</Typography>
              <Typography>Game Type: {game.gameType}</Typography>
              <Typography sx={{ mb: 2 }}>
                Players: {game.playerCount}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Visibility />}
                fullWidth
                onClick={() =>
                  navigate(
                    `/lobby/${game.gameType}/${game.lobbyNumber}/spectate`
                  )
                }
              >
                Spectate
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default LiveGamesPage;
	