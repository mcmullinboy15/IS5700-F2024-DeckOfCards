import { Button } from "@mui/material";
import ChatComponent from "../components/ChatComponent";

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
        </div>
      </div>
      <ChatComponent chatName="Game Room Chat" />
    </div>
  );
};

export default GameRoom;
