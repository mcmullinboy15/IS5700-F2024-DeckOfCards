import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

// Types for game records. Not built yet I don't think so this is filler.
interface GameRecord {
  id: string;
  gameType: "poker" | "blackjack" | "roulette";
  timestamp: string;
  result: "won" | "lost";
  stakes?: string; // Optional for games like roulette
  amountChanged: number; // Positive for wins, negative for losses
  opponentCount?: number; // For poker
  finalHand?: string; // For poker and blackjack
  gameRoomId: string;
}

interface GameLogProps {
  games: GameRecord[];
  isLoading?: boolean; // For future loading state
  error?: string; // For future error handling
}

const GameLog = ({ games }: GameLogProps) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number) => {
    const prefix = amount >= 0 ? "+" : "";
    return `${prefix}$${Math.abs(amount)}`;
  };

  return (
    <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Game History
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game</TableCell>
              <TableCell>Stakes</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Profit/Loss</TableCell>
              <TableCell>Date</TableCell>
              {/* Can add more columns as game features are implemented */}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Show message when no games */}
            {games.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">
                    No games played yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Map through actual games */}
            {games.map((game) => (
              <TableRow key={game.id} hover>
                <TableCell>
                  {game.gameType.charAt(0).toUpperCase() +
                    game.gameType.slice(1)}
                </TableCell>
                <TableCell>{game.stakes || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={game.result.toUpperCase()}
                    size="small"
                    color={game.result === "won" ? "success" : "error"}
                    sx={{ minWidth: 70 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    color={
                      game.amountChanged >= 0 ? "success.main" : "error.main"
                    }
                  >
                    {formatAmount(game.amountChanged)}
                  </Typography>
                </TableCell>
                <TableCell>{formatTimestamp(game.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GameLog;
