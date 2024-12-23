import { BrowserRouter as Router } from "react-router-dom";
import { RouterProvider } from "./components/layout/Router";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <RouterProvider />
      </Layout>
    </Router>
  );
}

export default App;
