import Card from "@/app/components/card/card";

interface PlayerHandProps {
  cards: {
    id: number;
    color: string;
    value: string;
  }[];
  onCardPlay: (card: { id: number; color: string; value: string }) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onCardPlay }) => {
  return (
    <div
      className="player-hand"
      style={{ display: "flex", flexDirection: "row" }}
    >
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={() => onCardPlay(card)} />
      ))}
    </div>
  );
};

export default PlayerHand;
