import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";

export const RouterProvider = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};
