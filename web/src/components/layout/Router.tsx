import { Routes, Route } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Login from "../Login";

export const RouterProvider = () => {
   return (
      <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Login />} />
      </Routes>
   );
};
