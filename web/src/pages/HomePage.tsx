import { useState } from "react";
import GameCard from "../components/GameCard";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
} from "@mui/material";

interface Game {
	id: number;
	name: string;
	actions: string[];
	description: string;
}

const games: Game[] = [
	{
		id: 1,
		name: "Poker",
		actions: ["Join", "Create", "Spectate", "Start"],
		description:
			"Texas Hold'em Poker is a variant of poker where players receive two hole cards and share five community cards. Make the best five-card hand to win!",
	},
	{
		id: 2,
		name: "Blackjack",
		actions: ["Join", "Create", "Spectate", "Start"],
		description:
			"Try to beat the dealer by getting as close to 21 as possible without going over. Face cards are worth 10, Aces can be 1 or 11.",
	},
	{
		id: 3,
		name: "Insert Game Here",
		actions: ["Join", "Create", "Spectate", "Start"],
		description: "Insert description here.",
	},
];

const HomePage: React.FC = () => {
	const [selectedGame, setSelectedGame] = useState<Game | null>(null);

	const handleClickAction = (gameName: string, action: string) => {
		console.log(`You selected "${action}" for ${gameName}`);
	};

	return (
		<div className="home-page">
			<h1>Welcome! Let's Play Some Games!</h1>
			<h2>Select a game to start:</h2>
			<div className="game-list">
				{games.map((game) => (
					<div key={game.id}>
						<GameCard game={game} onClickAction={handleClickAction} />
						<Button
							variant="text"
							color="primary"
							onClick={() => setSelectedGame(game)}
							sx={{ mt: 1 }}
						>
							Learn More
						</Button>
					</div>
				))}
			</div>

			<Dialog open={Boolean(selectedGame)} onClose={() => setSelectedGame(null)}>
				<DialogTitle>{selectedGame?.name}</DialogTitle>
				<DialogContent>
					<Typography>{selectedGame?.description}</Typography>{" "}
					{/* I added a description for each of the games listed when I started this.*/}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setSelectedGame(null)}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default HomePage;
