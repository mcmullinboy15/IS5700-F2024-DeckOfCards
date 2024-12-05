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
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";

interface Player {
  id: string;
  displayName: string;
}

const Lobby: React.FC = () => {
  const { getCollection, updateDocument } = useFirestore();
  const { gameType } = useParams();

  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archiving, setArchiving] = useState<string | null>(null);

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
            game.gameType?.toLowerCase() === gameType?.toLowerCase() &&
            !game.archived //only show non-archived games
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

  const handleArchiveGame = async (gameId: string) => {
    try {
      setArchiving(gameId);
      setError(null);

      const updateData = {
        archived: true,
        archivedAt: new Date().toISOString(),
        archivedBy: user?.displayName || user?.email || "anonymous",
        status: 'archived'
      };

      await updateDocument("games", gameId, updateData);
      
      //remove the archived game from the local state
      setGames(prevGames => prevGames.filter(game => game.id !== gameId));
      
    } catch (err) {
      console.error("Error archiving game:", err);
      setError("Failed to archive game. Please try again later.");
    } finally {
      setArchiving(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {gameType} Lobby
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
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
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleJoinGame(game)}
                        disabled={archiving === game.id}
                      >
                        Join Game
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleArchiveGame(game.id)}
                        disabled={archiving === game.id}
                      >
                        {archiving === game.id ? 'Archiving...' : 'Archive Game'}
                      </Button>
                    </div>
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