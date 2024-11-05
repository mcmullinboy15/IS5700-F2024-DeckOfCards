import './App.css'

import { BrowserRouter as Router } from 'react-router-dom';
import { RouterProvider } from './components/layout/Router';

function App() {
  return (
    <Router>
      <RouterProvider />
    </Router>
  )
}

export default App;
