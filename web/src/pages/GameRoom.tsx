import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import useGameState from "../hooks/useGameState";
import ChatComponent from "../components/ChatComponent";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import BlackJackTable from "../components/BlackJackTable";
// import MuiCard from "@mui/material/Card";

const GameRoom: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const location = useLocation();
  const { game: initialGame } = location.state || {};
  const gameState = useGameState(initialGame);
  const game = gameState.object;

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

  // ========Example usage for the player information to be passed to this prop===========

  const tempplayers = game.players;
  console.log("tempplayers", tempplayers);
  // [{name: "name1", bet:40, cards: cards1, total: 31, busted:false, actionOn:false},
  //   {name: "name2", bet:10, cards: cards1, total:15, busted:false, actionOn:false},
  //   {name: "name3", bet:50, cards: cards2, total:15, busted:false, actionOn:false},
  //   {name: "name4", bet:15, cards: cards3, total:15, busted:false, actionOn:true}];

  return (
    <div className="h-screen">
      <div className="mx-auto">
        <h1>{game?.name}</h1>
        <div>
          Players:{" "}
          {game?.players.map((player: any) => (
            <div key={player.id}>{player.displayName}</div>
          ))}
        </div>
        <div>Game Type: {game?.gameType}</div>
      </div>

      <div className="flex items-center h-[100%] bg-gray-800 text-white">
        <div className="mx-auto">
          {game?.gameType == "Blackjack" && (
            <BlackJackTable players={tempplayers} />
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-[2%] p-4 h-[12%]">
          <Button
            variant="outlined"
            sx={{
              fontSize: "25px",
              borderColor: "#FFD700",
              borderWidth: "2px",
              color: "red",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "20px",
              width: "20%",
              maxWidth: "150px",
            }}
          >
            Hit
          </Button>
          <Button
            variant="outlined"
            sx={{
              fontSize: "25px",
              borderColor: "#FFD700",
              borderWidth: "2px",
              color: "yellow",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "20px",
              width: "20%",
              maxWidth: "150px",
            }}
          >
            Stand
          </Button>
          <Button
            variant="outlined"
            sx={{
              fontSize: "25px",
              borderColor: "#FFD700",
              borderWidth: "2px",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "20px",
              width: "20%",
              maxWidth: "150px",
            }}
          >
            Split
          </Button>
          {/* <GameRulesModal gameTitle="Poker" rulesData={pokerRules}/> */}
          {/* I didn't write out the gamerules, but all the game information is defined on the homepage so we could use that */}
          {/* <CopyGameLink gameId="game_123" isActive={true} /> */}
          {/* This would come from game state/status */}
        </div>
      </div>
      {user ? (
        <ChatComponent chatName="Game Room Chat" />
      ) : (
        <div className="text-center mt-4 text-red-500">
          Please sign in to access the chat.
        </div>
      )}
    </div>
  );
};

export default GameRoom;
