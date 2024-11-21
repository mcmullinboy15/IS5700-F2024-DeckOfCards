import { BrowserRouter as Router } from "react-router-dom";
import { RouterProvider } from "./components/layout/Router";
import Layout from "./components/layout/Layout";
import ChatComponent from "./components/ChatComponent";

function App() {
  return (
    <Router>
      <Layout>
        <RouterProvider />
        <ChatComponent />
      </Layout>
    </Router>
  );
}

export default App;
