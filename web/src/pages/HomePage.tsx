import GameCard from "../components/GameCard.tsx";

interface Game {
  id: number;
  name: string;
  actions: string[];
}

const games: Game[] = [
  { id: 1, name: "Poker", actions: ["Join", "Create", "Spectate", "Start"] },
  {
    id: 2,
    name: "Blackjack",
    actions: ["Join", "Create", "Spectate", "Start"],
  },
  {
    id: 3,
    name: "Insert Game Here",
    actions: ["Join", "Create", "Spectate", "Start"],
  },
];

const HomePage: React.FC = () => {
  const handleClickAction = (gameName: string, action: string) => {
    console.log(`You selected "${action}" for ${gameName}`);
  };

  return (
    <div className="home-page">
      <h1>Welcome! Let's Play Some Games!</h1>
      <h2>Select a game to start:</h2>
      <div className="game-list">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClickAction={handleClickAction}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
