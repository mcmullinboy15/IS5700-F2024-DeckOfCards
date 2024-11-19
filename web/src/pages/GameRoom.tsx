import { Button } from "@mui/material";
import ChatComponent from "../components/ChatComponent";
import CopyGameLink from "../components/CopyGameLink";
// import GameRulesModal from "../components/GameRulesModal"; // Not used yet

const GameRoom: React.FC = () => {
   return (
      <div className="h-screen">
         <div className="flex items-center h-[100%] bg-gray-800 text-white">
            <div className="mx-auto">Table Animation Component Here...</div>
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
               <CopyGameLink gameId="game_123" isActive={true} />
               {/* This would come from game state/status */}
            </div>
         </div>
         <ChatComponent />
      </div>
   );
};

export default GameRoom;
