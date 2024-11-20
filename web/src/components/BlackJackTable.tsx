import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import { Typography } from "@mui/material";

export default function BlackJackTable({}) {
  return (
    <>
      <Box
        id="table"
        sx={{
          bgcolor: "gold",
          width: "100vh",
          height: "80vh",
          mb: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        table
        <Box sx={{ flexGrow: 1 }}>main area</Box>
        <Box
          // {/* Player row */}
          id="player-row"
          sx={{
            bgcolor: "grey",
            bottom: 0,
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {/* PLAYER HAND */}
          <Box
            sx={{
              bgcolor: "black",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "red" }}>BUSTED</Typography>
            <MuiCard
              sx={{
                width: "auto",
                px: 1,
                display: "flex",
                justifyContent: "center",
                margin: 1,
              }}
            >
              bet
            </MuiCard>

            <Box
              id="cards"
              sx={{ display: "flex", flexDirection: "row", gap: 2 }}
            >
              <MuiCard sx={{ height: 150, width: 90 }}>Card 1</MuiCard>
              <MuiCard sx={{ height: 150, width: 90 }}>Card 2</MuiCard>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
