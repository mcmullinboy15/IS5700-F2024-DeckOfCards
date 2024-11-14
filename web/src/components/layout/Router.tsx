import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Lobby from "../Lobby";
import StartGame from "../StartGame";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
<<<<<<< HEAD
      <Route path="/lobby/:gameType" element={<Lobby />} />
      <Route path="start-game/:gameType" element={<StartGame />} />
=======
      <Route path="/lobby/:gameName" element={<Lobby />} />
      <Route path="start-game" element={<StartGame />} />
>>>>>>> 500dee4d28ac2add607b7346df722692c8ca6764
    </Routes>
  );
};
