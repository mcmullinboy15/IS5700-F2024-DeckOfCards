import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

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
          id="player-row"
          sx={{
            bgcolor: "grey",
            bottom: 0,
            display: "flex",
            flexDirection: "row",
          }}
        >
            <Box>
                {/* PLAYER HAND */}
                <Card>Here is a card</Card>
            </Box>
          player row
        </Box>
      </Box>
    </>
  );
}
