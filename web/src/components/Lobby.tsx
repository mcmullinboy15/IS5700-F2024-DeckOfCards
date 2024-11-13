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
  const { gameName } = useParams();

  const navigate = useNavigate();

  const handleStartGameClick = () => {
    navigate("/start-game"); // Replace with the path to your StartGame component
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        {gameName} Lobby
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
