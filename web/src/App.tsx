import { BrowserRouter as Router } from "react-router-dom";
import { RouterProvider } from "./components/layout/Router";
import Layout from "./Layout";

function App() {
  return (
    <Layout>
      <Router>
        <RouterProvider />
      </Router>
    </Layout>
  );
}

export default App;
