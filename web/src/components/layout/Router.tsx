import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Lobby from "../Lobby";
import StartGame from "../StartGame";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby/:gameType" element={<Lobby />} />
      <Route path="start-game/:gameType" element={<StartGame />} />
    </Routes>
  );
};
