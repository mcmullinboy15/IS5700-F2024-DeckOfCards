import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import ChatComponent from "../ChatComponent";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="chat" element={<ChatComponent />} />
    </Routes>
  );
};
