
// All Card Codes:
[
  "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "0S", "JS", "QS", "KS", // Spades
  "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "0H", "JH", "QH", "KH", // Hearts
  "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "0C", "JC", "QC", "KC", // Clubs
  "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "0D", "JD", "QD", "KD", // Diamonds
  "X1", "X2"  // Jokers
]

type CardProps = {
  cardCode: string;
};

export const CardComponent: React.FC<CardProps> = ({ cardCode }) => {
  return <img src={`/cards/${cardCode}.png`} alt={`Card: ${cardCode}`} />;
};
