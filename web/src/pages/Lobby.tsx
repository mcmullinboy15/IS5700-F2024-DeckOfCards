import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../firebase/db";
import { v4 as uuidv4 } from "uuid";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableBody,
  Box,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

interface Player {
  id: string;
  displayName: string;
}

const StyledTableContainer = styled(Paper)({
  backgroundColor: "rgba(17, 25, 40, 0.75)",
  borderRadius: "12px",
  overflow: "hidden",
  marginTop: "2rem",
});

const StyledTable = styled(Table)({
  "& .MuiTableCell-root": {
    color: "white",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    fontWeight: 600,
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
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
});

const CreateGameButton = styled(Button)({
  borderRadius: "8px",
  padding: "12px 32px",
  backgroundColor: "rgba(139, 92, 246, 0.9)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 1)",
  },
  textTransform: "none",
  fontSize: "1.1rem",
});

const Lobby: React.FC = () => {
  const { getCollection, updateDocument } = useFirestore();
  const { gameType } = useParams();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getCollection("games");
        const allGames = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredGames = allGames.filter(
          (game: any) =>
            game.gameType?.toLowerCase() === gameType?.toLowerCase()
        );
        setGames(filteredGames);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [getCollection, gameType]);

  const handleCreateGameClick = () => {
    navigate(`/create-game/${gameType}`);
  };

  const handleJoinGame = (game: any) => {
    const newPlayer: Player = {
      id: uuidv4(),
      displayName: user?.displayName || user?.email || "anonymous",
    };
    const players = [...game.players, newPlayer];
    updateDocument("games", game.id, { players })
      .then(() => console.log("Player added to game"))
      .catch((err) => console.error("Error adding player to game:", err));
    navigate(`/game/${game.gameType}/${game.id}`, {
      state: {
        game: {
          ...game,
          players,
        },
      },
    });
  };

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
              mb: 4,
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
            }}
          >
            {gameType} Lobby
          </Typography>

          <StyledTableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Game Name</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Players</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading games...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ color: "#ff6b6b" }}
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : games.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No games available.
                    </TableCell>
                  </TableRow>
                ) : (
                  games.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell align="center">{game.name}</TableCell>
                      <TableCell align="center">{game.desc}</TableCell>
                      <TableCell align="center">
                        {game.players.length}
                      </TableCell>
                      <TableCell align="center">
                        <ActionButton
                          variant="contained"
                          onClick={() => handleJoinGame(game)}
                        >
                          Join Game
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </StyledTable>
          </StyledTableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CreateGameButton
              onClick={handleCreateGameClick}
              variant="contained"
            >
              Create a Game
            </CreateGameButton>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Lobby;
