import { useParams, useNavigate } from "react-router-dom";
import { useFirestore } from "../firebase/db.ts";

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

const Lobby = () => {

  //logic to retrieve games of the selected game type
  const { gameType } = useParams();

  const navigate = useNavigate();

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
