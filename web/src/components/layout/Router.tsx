import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import { ProfileWrapper } from "../../pages/Profile";
import Lobby from "../../pages/Lobby";
import CreateGame from "../../pages/CreateGame";
import GameRoom from "../../pages/GameRoom";
import Login from "../../pages/Login";
import { RegisterPage } from "../../pages/RegisterPage";
import PokerRoom from "../../pages/PokerRoom";
import LiveGamesPage from "../../pages/LiveGamesPage";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile/:userId" element={<ProfileWrapper />} />
      <Route path="/lobby/:gameType" element={<Lobby />} />
      <Route path="/poker-room/:roomId" element={<PokerRoom />} />
      <Route path="/lobby/:gameType/:lobbyId/spectate" element={<Lobby />} />
      <Route path="/livegames" element={<LiveGamesPage />} />
      <Route path="create-game/:gameType" element={<CreateGame />} />
      <Route path="/game/:gameType/:gameId" element={<GameRoom />} />
    </Routes>
  );
};
