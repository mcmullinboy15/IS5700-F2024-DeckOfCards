import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../firebase/db";

import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableBody,
} from "@mui/material";

const Lobby: React.FC = () => {
  //logic to retrieve games of the selected game type
  const { getCollection } = useFirestore();
  const { gameType } = useParams();

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true); // Indicate loading
        const querySnapshot = await getCollection("games");

        const allGames = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Filter games by gameType
        const filteredGames = allGames.filter(
          (game: any) => game.gameType === gameType
        );
        setGames(filteredGames);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false); // End loading state
      }
    };
    fetchGames();
  }, [getCollection, gameType]);

  const handleCreateGameClick = () => {
    navigate(`/create-game/${gameType}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {gameType} Lobby
      </Typography>
      <div className="live-game-table-container">
        <Table className="live-game-table">
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
                <TableCell colSpan={4} align="center" style={{ color: "red" }}>
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
                  <TableCell align="center">{game.players.length}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        navigate(`/game/${game.gameType}/${game.id}`, {
                          state: { game },
                        })
                      }
                    >
                      Join Game
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Button
        onClick={handleCreateGameClick}
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
      >
        Create a Game
      </Button>
    </Container>
  );
};

export default Lobby;
