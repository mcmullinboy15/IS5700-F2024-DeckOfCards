import Box from "@mui/material/Box";
import PlayerHand from "./PlayerHand";
import MuiCard from "@mui/material/Card";

export default function BlackJackTable({}) {

  const cards1 = [<MuiCard sx={{ height: 150, width: 90 }}>Card 1</MuiCard>,
  <MuiCard sx={{ height: 150, width: 90 }}>Card 2</MuiCard>]
  const cards2 = [<MuiCard sx={{ height: 150, width: 90 }}>Card 3</MuiCard>,
    <MuiCard sx={{ height: 150, width: 90 }}>Card 4</MuiCard>]
    const cards3 = [<MuiCard sx={{ height: 150, width: 90 }}>Card 5</MuiCard>,
      <MuiCard sx={{ height: 150, width: 90 }}>Card 6</MuiCard>]
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
            gap:2,
          }}
        >
          <PlayerHand busted={true} bet={40} cards={cards1}/>
          <PlayerHand busted={false} bet={20} cards={cards2}/>
          <PlayerHand busted={false} bet={30} cards={cards3} />
        </Box>
      </Box>
    </>
  );
}
