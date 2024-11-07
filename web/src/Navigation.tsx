import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
    <nav>
      <ul style={{listStyle: "none", textAlign: "left"}}>
        <li>
          <Link style={{textDecoration: "none"}} to="/">Home</Link>
        </li>
        <li>
          <Link style={{textDecoration: "none"}} to="/game">Game</Link>
        </li>
        <li>
          <Link style={{textDecoration: "none"}} to="/chat">Chat</Link>
        </li>
      </ul>
    </nav>
  </div>
  );
}

export default Navigation;