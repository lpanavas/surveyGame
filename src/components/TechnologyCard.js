import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import "./styles/TechnologyCard.css";

const TechnologyCard = ({
  tech,
  handleChoice,
  index,
  selectionMade,
  percent,
}) => {
  const [clicked, setClicked] = useState(false);

  const props = useSpring({
    from: { opacity: 0, transform: "scale(0)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 210, friction: 20 },
  });

  const percentProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 210, friction: 20 },
  });

  const handleClick = () => {
    if (setClicked === true || selectionMade === true) {
      return; // If a card is already selected, do nothing
    }
    handleChoice(index);
    setClicked(true);
  };

  return (
    <a.div style={props} className="technology-card" onClick={handleClick}>
      {!selectionMade ? (
        <h3>{tech.title}</h3>
      ) : (
        <div className="percentage-div">
          <h3>{tech.title}</h3>
          <h4>
            You agree with{" "}
            {clicked
              ? `${percent.selectedCard}%`
              : `${percent.unselectedCard}%`}{" "}
            of people{" "}
          </h4>
        </div>
      )}
    </a.div>
  );
};

export default TechnologyCard;
