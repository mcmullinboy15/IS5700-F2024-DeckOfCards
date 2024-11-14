import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { TextField, Typography, Button, Box } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

interface Player {
  id: string;
  name: string;
}
interface newGame {
  name: string;
  desc: string;
  players: Player[];
  gameType: string;
}

const StartGame: React.FC = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const [gameName, setGameName] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const [user, setUser] = useState('user');
  const [players, setPlayers] = useState<Player[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newPlayer: Player = {
      id: uuidv4(),
      name: user
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);

    const newGame: newGame = {
      name: gameName,
      desc: gameDesc,
      players: [...players, newPlayer],
      gameType: gameType || ""
    };
    console.log("GAME NAME: ", newGame.name);
    console.log("GAME DESC: ", newGame.desc);
    console.log('PLAYERS: ', newGame.players);
    console.log('GAME TYPE: ', newGame.gameType);

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

export default StartGame;
