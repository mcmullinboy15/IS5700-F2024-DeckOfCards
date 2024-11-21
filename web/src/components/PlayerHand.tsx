import MuiCard from "@mui/material/Card";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
// import type {Card} from "../game-logic/api"

interface PlayerHandProps {
  busted: boolean;
  bet: number;
  cards: JSX.Element[];
  name: String;
  actionOn: boolean;
  total: number;
}

export default function PlayerHand({ name, busted, bet, cards, actionOn=false, total }: PlayerHandProps) {
    const bgColor = (actionOn ? "#363636" : null);
  return (
    <>
      {/* PLAYER HAND */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: bgColor,
          padding: 2
        }}
      >
        {busted ? (
          <Typography variant="h5" sx={{ color: "red" }}>
            BUSTED
          </Typography>
        ) : <Typography variant="h5">
        {total}
      </Typography>}
        <Typography variant="h5">
            {name}
          </Typography>
        <MuiCard
          sx={{
            width: "auto",
            px: 1,
            display: "flex",
            justifyContent: "center",
            margin: 1,
          }}
        >
          <Typography sx={{font:"roboto"}}>{bet}</Typography>
        </MuiCard>

        <Box id="cards" sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {cards}
        </Box>
      </Box>
    </>
  );
}
