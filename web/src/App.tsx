import { BrowserRouter as Router } from "react-router-dom";
import { RouterProvider } from "./components/layout/Router";
import Layout from "./components/layout/Layout";
import ChatComponent from "./components/ChatComponent";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  return (
    <Router>
      <Layout>
        <RouterProvider />
        {user ? (
        <ChatComponent chatName="Game Room Chat" />
      ) : (
        <div className="text-center mt-4 text-red-500">
          Please sign in to access the chat.
        </div>
      )}
      </Layout>
    </Router>
  );
}

export default App;
