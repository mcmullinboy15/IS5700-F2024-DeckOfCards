import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import useGameState from "../hooks/useGameState";
import ChatComponent from "../components/ChatComponent";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const GameRoom: React.FC = () => {
<<<<<<< HEAD
  const authContext = useContext(AuthContext);

  const user = authContext?.user;
=======
  const location = useLocation();
  const { initialGame } = location.state || {};
  console.log("INITIAL GAME: ", initialGame);
  const gameState = useGameState(initialGame);
  const game = gameState.object;
  console.log("GAME: ", game);
>>>>>>> main

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
        </div>
      </div>
<<<<<<< HEAD
      {user ? (
        <ChatComponent chatName="Game Room Chat" />
      ) : (
        <div className="text-center mt-4 text-red-500">
          Please sign in to access the chat.
        </div>
      )}
=======
      <ChatComponent />
>>>>>>> main
    </div>
  );
};

export default GameRoom;
