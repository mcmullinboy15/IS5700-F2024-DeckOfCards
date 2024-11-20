import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import ChatComponent from "../ChatComponent";
import { ProfileWrapper } from "../../pages/Profile";
import Lobby from "../../pages/Lobby";
import StartGame from "../../pages/StartGame";
import Login from "../../pages/Login";
import { RegisterPage } from "../../pages/RegisterPage";
import GameRoom from "../../pages/GameRoom";
import BlackJackTable from "../BlackJackTable";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="chat" element={<ChatComponent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile/:userId" element={<ProfileWrapper />} />
      <Route path="/lobby/:gameType" element={<Lobby />} />
      <Route path="start-game/:gameType" element={<StartGame />} />
      <Route path="/gameroom" element={<GameRoom><BlackJackTable/></GameRoom>} />
    </Routes>
  );
};
