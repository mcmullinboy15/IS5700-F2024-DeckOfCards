import Box from "@mui/material/Box";
import PlayerHand from "./PlayerHand";
import MuiCard from "@mui/material/Card";
import { Typography } from "@mui/material";

export default function BlackJackTable({actionOnDealer=false}) {





  const cards1 = [
    <MuiCard sx={{ height: 150, width: 90 }}>Card 1</MuiCard>,
    <MuiCard sx={{ height: 150, width: 90 }}>Card 2</MuiCard>,
  ];
  const cards2 = [
    <MuiCard sx={{ height: 150, width: 90 }}>Card 3</MuiCard>,
    <MuiCard sx={{ height: 150, width: 90 }}>Card 4</MuiCard>,
  ];
  const cards3 = [
    <MuiCard sx={{ height: 150, width: 90 }}>Card 5</MuiCard>,
    <MuiCard sx={{ height: 150, width: 90 }}>Card 6</MuiCard>,
  ];

  const bgColor = (actionOnDealer ? "#b38c00" : null);

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
        <Typography variant="h3">BlackJack Game</Typography>
        {/* Dealer Cards */}
        <Box sx={{ flexGrow: 1, justifyContent:"center", alignContent:'center' }}>
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        <Box sx={{display:"flex", flexDirection:"row", gap:2, bgcolor: bgColor, padding:2}}>
        <MuiCard sx={{ height: 150, width: 90 }}>Card 6</MuiCard>
        <MuiCard sx={{ height: 150, width: 90 }}>Card 6</MuiCard>
        </Box>
        </Box>
        </Box>
        <Box
          // {/* Player row */}
          id="player-row"
          sx={{
            bgcolor: "grey",
            bottom: 0,
            display: "flex",
            flexDirection: "row",
            flexWrap:"wrap",
            alignContent: "center",
            justifyContent: "center",
            padding: 2,
            gap: 2,
          }}
        >
          
          <PlayerHand name="Name1" busted={true} bet={40} cards={cards1} actionOn={true} />
          <PlayerHand name="Name2" busted={false} bet={20} cards={cards2} actionOn={false} />
          <PlayerHand name="Name3" busted={false} bet={30} cards={cards3} actionOn={false} />
          <PlayerHand name="Name1" busted={true} bet={40} cards={cards1} actionOn={false} />
          <PlayerHand name="Name2" busted={false} bet={20} cards={cards2} actionOn={false} />
          <PlayerHand name="Name3" busted={false} bet={30} cards={cards3} actionOn={false} />
          
        </Box>
      </Box>
    </>
  );
}
