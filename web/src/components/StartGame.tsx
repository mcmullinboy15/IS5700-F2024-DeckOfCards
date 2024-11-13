import React, { useState } from "react";
import { TextField, Typography, Button, Box } from "@mui/material";

interface newGame {
  name: string;
  desc: string;
}

const StartGame: React.FC = () => {
  const [gameName, setGameName] = useState("");
  const [gameDesc, setGameDesc] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("GAME NAME: ", gameName);
    console.log("GAME DESC: ", gameDesc);
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
        Start a Game
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
