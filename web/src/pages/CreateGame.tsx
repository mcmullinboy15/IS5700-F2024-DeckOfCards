import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Typography, Button, Box, styled } from "@mui/material";
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

const StyledContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
  color: "white",
});

const StyledForm = styled(Box)({
  backgroundColor: "rgba(17, 25, 40, 0.85)",
  borderRadius: "12px",
  padding: "32px",
  maxWidth: "500px",
  width: "100%",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
});

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "white",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(139, 92, 246, 0.9)",
    },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: "rgba(139, 92, 246, 0.9)",
  color: "white",
  textTransform: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 1)",
  },
});

const CreateGame: React.FC = () => {
  const { addDocument } = useFirestore();
  const { gameType } = useParams<{ gameType: string }>();
  const [gameName, setGameName] = useState("");
  const [gameDesc, setGameDesc] = useState("");
  const { user } = useContext(AuthContext) || {};
  const [players, setPlayers] = useState<Player[]>([]);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newPlayer: Player = {
      id: uuidv4(),
      displayName: user?.displayName || user?.email || "anonymous",
    };

    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);

    const newGame: Omit<newGame, "id"> = {
      timestamp: Date.now(),
      name: gameName,
      desc: gameDesc,
      creatorId: uuidv4(),
      players: [...players, newPlayer],
      gameType: gameType || "",
    };
    console.log("newGame", newGame);

    //insert game into database
    try {
      const gameId = await addDocument("games", newGame);
      console.log("game added successfully with id: ", gameId);
      navigate(`/game/${newGame.gameType}/${gameId}`, {
        state: { game: newGame },
      });
    } catch (error) {
      console.error("error adding game: ", error);
    }
  };

  const handleGameNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameName(event.target.value);
  };

  const handleGameDescChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameDesc(event.target.value);
  };

  return (
    <StyledContainer>
      <StyledForm as="form" onSubmit={handleSubmit}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Start a {gameType} Game
        </Typography>
        <Box sx={{ marginBottom: 3 }}>
          <StyledTextField
            label="Game Name"
            variant="outlined"
            fullWidth
            required
            value={gameName}
            onChange={handleGameNameChange}
          />
        </Box>
        <Box sx={{ marginBottom: 3 }}>
          <StyledTextField
            label="Game Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={gameDesc}
            onChange={handleGameDescChange}
          />
        </Box>
        <StyledButton type="submit" fullWidth>
          Start Game
        </StyledButton>
      </StyledForm>
    </StyledContainer>
  );
};

export default CreateGame;
