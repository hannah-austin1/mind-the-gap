import { Wildcard } from "@/app/lib/wildcards";
import { StationCard } from "@/app/providers/game-engine-provider";

interface CardProps {
  card: StationCard | Wildcard;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ card, onClick }) => {
  const isStationCard = "station" in card;

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        border: "2px solid #ddd",
        backgroundColor: "white",
        borderRadius: "15px",
        padding: "10px",
        width: "150px",
        height: "220px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {isStationCard ? (
        <div>
          <div style={styles.linesContainer}>
            {card.lines.map((line, index) => (
              <div
                key={index}
                style={{
                  ...styles.line,
                  backgroundColor: line.color,
                }}
              >
                {line.name}
              </div>
            ))}
          </div>
          <div style={styles.stationName}>{card.station}</div>
        </div>
      ) : (
        <div style={styles.wildcardText}>
          <div>{card.text}</div>
          <small>{card.description}</small>
        </div>
      )}
    </div>
  );
};

const styles = {
  linesContainer: {
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column" as "column",
  },
  line: {
    height: "20px",
    borderRadius: "5px",
    marginBottom: "4px",
    fontSize: "12px",
    color: "white",
    textAlign: "center" as "center",
    lineHeight: "20px",
  },
  stationName: {
    fontSize: "20px",
    fontWeight: "bold" as "bold",
    marginTop: "10px",
    marginBottom: "20px",
    color: "black",
  },
  wildcardText: {
    fontSize: "18px",
    fontWeight: "bold" as "bold",
    marginTop: "10px",
    marginBottom: "20px",
    color: "black",
  },
};
