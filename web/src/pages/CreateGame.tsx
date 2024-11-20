import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Typography, Button, Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { useFirestore } from "../firebase/db";

interface Player {
  id: string;
  displayName: string;
}
interface newGame {
  id: string;
  timestamp: number;
  name: string;
  desc: string;
  creatorId: string;
  players: Player[];
  gameType: string;
}

const CreateGame: React.FC = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const [gameName, setGameName] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  // @ts-ignore
  const { user } = useContext(AuthContext) || {};
  const [players, setPlayers] = useState<Player[]>([]);

  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newPlayer: Player = {
      id: uuidv4(),
      displayName: user?.displayName || user?.email || "anonymous",
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);

    const newGame: newGame = {
      id: uuidv4(),
      timestamp: Date.now(),
      name: gameName,
      desc: gameDesc,
      creatorId: uuidv4(),
      players: [...players, newPlayer],
      gameType: gameType || "",
    };

    //insert game into database

    console.log('GAME ID: ', newGame.id);
    console.log('TIMESTAMP: ', newGame.timestamp);
    console.log("GAME NAME: ", newGame.name);
    console.log("GAME DESC: ", newGame.desc);
    console.log("PLAYERS: ", newGame.players);
    console.log("GAME TYPE: ", newGame.gameType);

    navigate(`/game/${newGame.gameType}/${newGame.id}`, { state: { game: newGame } });
  };

  const handleGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleGameDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameDesc(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Start a {gameType} Game
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Game Name"
            variant="outlined"
            fullWidth
            required
            value={gameName} // Bind value to state
            onChange={handleGameNameChange}
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Game Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={gameDesc} // Bind value to state
            onChange={handleGameDescChange} // Handle input change
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Start Game
        </Button>
      </form>
    </Box>
  );
};

export default CreateGame;
