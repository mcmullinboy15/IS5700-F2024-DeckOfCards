import { useState } from "react";
import GameCard from "../components/GameCard";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

interface GameInfo {
  id: number;
  name: string;
  routeName: string;
  actions: string[];
  description: string;
}

const games: GameInfo[] = [
  {
    id: 1,
    name: "Poker",
    routeName: "poker",
    actions: ["Join", "Create", "Spectate", "Start"],
    description:
      "Texas Hold'em Poker is a variant of poker where players receive two hole cards and share five community cards. Make the best five-card hand to win!",
  },
  {
    id: 2,
    name: "Blackjack",
    routeName: "blackjack",
    actions: ["Join", "Create", "Spectate", "Start"],
    description:
      "Try to beat the dealer by getting as close to 21 as possible without going over. Face cards are worth 10, Aces can be 1 or 11.",
  },
  {
    id: 3,
    name: "Roulette",
    routeName: "roulette",
    actions: ["Join", "Create", "Spectate", "Start"],
    description:
      "Roulette is a game of chance where players bet on which number or color the ball will land on. The dealer spins the wheel and drops the ball in the opposite direction. Good luck!",
  },
];

const HomePage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameInfo | null>(null);

  const handleClickAction = (gameName: string, action: string) => {
    console.log(`You selected "${action}" for ${gameName}`);
  };

  return (
    <Container sx={{ bgcolor: "#c9e8ff" }} fixed>
      <div className="home-page">
        <Box
          sx={{
            bgcolor: "#b7e1ff",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
          }}
        >
          <Typography variant="h2">Welcome! Let's Play Some Games!</Typography>
        </Box>

        <Box
          sx={{
            bgcolor: "#c9e8ff",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
          }}
        >
          <Typography variant="h4">Select a game to start:</Typography>
        </Box>
        <div className="game-list">
          {games.map((game) => (
            <div key={game.id}>
              <Box
                sx={{
                  bgcolor: "#dbf0ff",
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  flexDirection: "column",
                }}
              >
                <GameCard game={game} onClickAction={handleClickAction} />
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => setSelectedGame(game)}
                  sx={{ mt: 1 }}
                >
                  Learn More
                </Button>
              </Box>
            </div>
          ))}
        </div>

        <Dialog
          open={Boolean(selectedGame)}
          onClose={() => setSelectedGame(null)}
        >
          <DialogTitle>{selectedGame?.name}</DialogTitle>
          <DialogContent>
            <Typography>{selectedGame?.description}</Typography>{" "}
            {/* I added a description for each of the games listed when I started this.*/}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedGame(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
};

export default HomePage;
