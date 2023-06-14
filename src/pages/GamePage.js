import React, { useEffect, useState } from "react";
import PairwiseGame from "../components/PairwiseGame";
import "../components/styles/GamePage.css";

function GamePage({ gamePath, prompt, finishGame }) {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(gamePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTechnologies(data.technologies);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Fetch error: ", error);
        setLoading(false);
      });
  }, [gamePath]);

  if (loading) {
    return <div className="game-page">Loading...</div>;
  }

  return (
    <div className="game-page">
      <div className="game-content">
        <PairwiseGame technologies={technologies} finishGame={finishGame} />
      </div>
      {/* <button className="finish-button" onClick={finishGame}>
        Finish Game
      </button> */}
    </div>
  );
}

export default GamePage;
