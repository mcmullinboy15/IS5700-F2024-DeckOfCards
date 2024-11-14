import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface LobbyParams {
  gameName: string;
}

const Lobby: React.FC<LobbyParams> = () => {
<<<<<<< HEAD
  const { gameType } = useParams();
=======
  const { gameName } = useParams();
>>>>>>> 500dee4d28ac2add607b7346df722692c8ca6764

  const navigate = useNavigate();

  const handleStartGameClick = () => {
<<<<<<< HEAD
    navigate(`/start-game/${gameType}`);
=======
    navigate("/start-game"); // Replace with the path to your StartGame component
>>>>>>> 500dee4d28ac2add607b7346df722692c8ca6764
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
<<<<<<< HEAD
        {gameType} Lobby
=======
        {gameName} Lobby
>>>>>>> 500dee4d28ac2add607b7346df722692c8ca6764
      </Typography>
      <div className="live-game-table-container">
        <Table className="live-game-table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Live Games</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>This is where games will be displayed</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleStartGameClick} variant="contained" color="primary" style={{ marginTop: "20px" }}>
        Start a Game
      </Button>
    </Container>
  );
};

export default Lobby;
