import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import ChatComponent from "../ChatComponent";
import Lobby from "../Lobby";
import StartGame from "../StartGame";
import Login from "../Login";
import { RegisterPage } from "../../pages/RegisterPage";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="chat" element={<ChatComponent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/lobby/:gameType" element={<Lobby />} />
      <Route path="start-game/:gameType" element={<StartGame />} />
    </Routes>
  );
};
