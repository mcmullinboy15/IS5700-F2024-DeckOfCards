import {
  Container,
  Typography,
  //Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

interface LiveGame {
  lobbyNumber: number;
  gameType: string;
  playerCount: number;
}

const GameCard = styled(motion.div)({
  backgroundColor: "rgba(17, 25, 40, 0.75)",
  borderRadius: "12px",
  overflow: "hidden",
  width: "100%",
});

const ActionButton = styled(Button)({
  borderRadius: "8px",
  padding: "8px 24px",
  backgroundColor: "rgba(139, 92, 246, 0.9)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 1)",
  },
  textTransform: "none",
});

const LiveGamesPage = () => {
  const navigate = useNavigate();

  const liveGames: LiveGame[] = [
    { lobbyNumber: 1, gameType: "poker", playerCount: 6 },
    { lobbyNumber: 2, gameType: "blackjack", playerCount: 3 },
    { lobbyNumber: 3, gameType: "roulette", playerCount: 4 },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
        color: "white",
        pb: 8,
        pt: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              mb: 6,
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
            }}
          >
            Live Games
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 4,
              maxWidth: "1200px",
              mx: "auto",
            }}
          >
            {liveGames.map((game) => (
              <GameCard
                key={game.lobbyNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Lobby #{game.lobbyNumber}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 1,
                      color: "rgba(255, 255, 255, 0.8)",
                      textTransform: "capitalize",
                    }}
                  >
                    Game Type: {game.gameType}
                  </Typography>
                  <Typography
                    sx={{
                      mb: 3,
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Players: {game.playerCount}
                  </Typography>
                  <ActionButton
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
                  </ActionButton>
                </CardContent>
              </GameCard>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LiveGamesPage;
