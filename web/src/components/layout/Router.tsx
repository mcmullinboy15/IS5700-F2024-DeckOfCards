import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Lobby from "../Lobby";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lobby/:gameName" element={<Lobby />} />
    </Routes>
  );
};
