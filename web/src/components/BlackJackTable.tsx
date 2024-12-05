import Box from "@mui/material/Box";
import PlayerHand from "./PlayerHand";
import MuiCard from "@mui/material/Card";
import { Typography } from "@mui/material";



interface BlackJackPlayer {
  name: string;
  bet: number;
  cards: JSX.Element[];
  total: number;
  busted: boolean;
  actionOn?: boolean;
}

interface BlackJackTableProps {
  actionOnDealer?: boolean;
  players: BlackJackPlayer[];
}

export default function BlackJackTable({actionOnDealer = false, players}: BlackJackTableProps) {

  // =========== EXAMPLE ===========

  // TODO: change the MUI Cards to our custom Card component wherever you are building the card lists for the player hands

  // const cards1 = [
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 1</MuiCard>,
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 2</MuiCard>,
  // ];
  // const cards2 = [
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 3</MuiCard>,
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 4</MuiCard>,
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 3</MuiCard>,
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 4</MuiCard>,
  // ];
  // const cards3 = [
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 5</MuiCard>,
  //   <MuiCard sx={{ height: 150, width: 90 }}>Card 6</MuiCard>,
  // ];

  // // ========Example usage for the player information to be passed to this prop===========

  // const players = [{name: "name1", bet:40, cards: cards1, busted:false, actionOn:false},
  //   {name: "name2", bet:10, cards: cards1, total:15, busted:false, actionOn:false},
  //   {name: "name3", bet:50, cards: cards2, total:15, busted:false, actionOn:false},
  //   {name: "name4", bet:15, cards: cards3, total:15, busted:false, actionOn:true},
  //   {name: "name5", bet:21, cards: cards1, total:15, busted:true, actionOn:false},
  // ]

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
            {players.map((p) => (
            <PlayerHand 
              name={p.name} 
              busted={p.busted} 
              bet={p.bet} 
              cards={p.cards} 
              actionOn={p.actionOn ?? false} 
              total={p.total}
            />
            ))}
        
          
        </Box>
      </Box>
    </>
  );
}
