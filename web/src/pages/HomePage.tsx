import { FC, useState } from "react";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Game {
  id: number;
  name: string;
  description: string;
  iconSrc: string;
  route: string;
}

const games: Game[] = [
  {
    id: 1,
    name: "Poker",
    description:
      "Texas Hold'em Poker is a variant of poker where players receive two hole cards and share five community cards. Make the best five-card hand to win!",
    iconSrc:
      "https://s.tmimgcdn.com/scr/398200/playing-card-icon-vector-design-template-illustration_398214-original.gif",
    route: "/lobby/poker",
  },
  {
    id: 2,
    name: "Blackjack",
    description:
      "Try to beat the dealer by getting as close to 21 as possible without going over. Face cards are worth 10, Aces can be 1 or 11.",
    iconSrc:
      "https://s.tmimgcdn.com/scr/398200/playing-card-vector-illustration-template_398205-original.gif",
    route: "/lobby/blackjack",
  },
  {
    id: 3,
    name: "Roulette",
    description:
      "Roulette is a game of chance where players bet on which number or color the ball will land on. The dealer spins the wheel and drops the ball in the opposite direction. Good luck!",
    iconSrc:
      "https://s.tmimgcdn.com/scr/398200/playing-card-icon-vector-design-illustration-template_398213-original.gif",
    route: "/lobby/roulette",
  },
];

const FilterButton = styled(Button)({
  borderRadius: "9999px",
  padding: "8px 24px",
  margin: "0 8px",
  textTransform: "none",
  color: "white",
  "&.active": {
    backgroundColor: "rgba(139, 92, 246, 0.9)",
  },
  "&:not(.active)": {
    backgroundColor: "rgba(75, 85, 99, 0.7)",
  },
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
  width: "100%",
  maxWidth: "200px",
});

const GameCard = styled(motion.div)({
  backgroundColor: "rgba(17, 25, 40, 0.75)",
  borderRadius: "12px",
  overflow: "hidden",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const HomePage: FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const filteredGames = selectedGame
    ? games.filter(
        (game) => game.name.toLowerCase() === selectedGame.toLowerCase()
      )
    : games;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
        color: "white",
        pb: 8,
      }}
    >
      <Box
        sx={{
          pt: 15,
          pb: 15,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", md: "4.5rem" },
            fontWeight: 800,
            mb: 2,
            fontFamily: "cursive",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          Deck of Cards Casino
        </Typography>
        <Typography
          variant="h5"
          sx={{
            maxWidth: "800px",
            mx: "auto",
            opacity: 0.9,
            px: 2,
          }}
        >
          Enjoy world-class Blackjack, Roulette, and Poker from the comfort of
          your home.
        </Typography>
      </Box>

      <Box
        sx={{
          width: "80%",
          maxWidth: "800px",
          height: "1px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          margin: "0 auto",
          mb: 8,
        }}
      />

      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 4,
            fontSize: { xs: "2rem", md: "3rem" },
            fontWeight: 700,
          }}
        >
          Our Games
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 6,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <FilterButton
            className={!selectedGame ? "active" : ""}
            onClick={() => setSelectedGame(null)}
          >
            All Games
          </FilterButton>
          {games.map((game) => (
            <FilterButton
              key={game.id}
              className={
                selectedGame === game.name.toLowerCase() ? "active" : ""
              }
              onClick={() => setSelectedGame(game.name.toLowerCase())}
            >
              {game.name}
            </FilterButton>
          ))}
        </Box>

        <AnimatePresence mode="wait">
          <Grid container spacing={3}>
            {filteredGames.map((game) => (
              <Grid item xs={12} md={4} key={game.id}>
                <GameCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      backgroundColor: "white",
                      p: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                      height: "200px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={game.iconSrc}
                      alt={game.name}
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                        transform: "scale(1.2)",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                      }}
                    >
                      {game.name}
                    </Typography>
                    <Typography
                      sx={{
                        opacity: 0.8,
                        lineHeight: 1.6,
                        mb: 3,
                      }}
                    >
                      {game.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "16px",
                        mt: "auto",
                      }}
                    >
                      <Link
                        to={game.route}
                        style={{
                          textDecoration: "none",
                          width: "100%",
                          maxWidth: "200px",
                        }}
                      >
                        <ActionButton variant="contained" fullWidth>
                          Create
                        </ActionButton>
                      </Link>
                    </Box>
                  </Box>
                </GameCard>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default HomePage;
