import React, { useState, useEffect } from "react";
import { useSpring, animated as a } from "react-spring"; // Added this line
import { useTrail, animated as b } from "react-spring";
import TechnologyCard from "./TechnologyCard";
import Rankings from "./Rankings";

import Button from "./Button";
import "./styles/PairwiseGame.css";

const firstBad = ["Harmful", "Unjust", "Disloyal", "Disobedient", "Indecent"];
const firstGood = ["Protective", "Impartial", "Loyal", "Respectful", "Decent"];
const secondBad = [
  "Violent",
  "Discriminatory",
  "Traitor",
  "Defiant",
  "Obscene",
];
const secondGood = ["Caring", "Fair", "Devoted", "Lawful", "Virtuous"];
const descriptors = {
  firstDescriptors: [...firstBad, ...firstGood],
  secondDescriptors: [...secondBad, ...secondGood],
};

const PairwiseGame = ({ technologies, finishGame }) => {
  const [shuffledTechnologies, setShuffledTechnologies] = useState([]);

  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [rankings, setRankings] = useState({});
  const [selectedDescriptors, setSelectedDescriptors] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [unselectedCard, setUnselectedCard] = useState(null);
  const [descriptorStage, setDescriptorStage] = useState("firstDescriptors");
  const [progress, setProgress] = useState(0);
  const [selectionMade, setSelectionMade] = useState(false);
  const [selectedPercent, setSelectedPercent] = useState(0);
  const [unselectedPercent, setUnselectedPercent] = useState(0);

  useEffect(() => {
    if (technologies.length > 0) {
      // Shuffle technologies array
      let shuffledTechnologies = [...technologies];
      for (let i = shuffledTechnologies.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledTechnologies[i], shuffledTechnologies[j]] = [
          shuffledTechnologies[j],
          shuffledTechnologies[i],
        ];
      }

      // Create pairs from the shuffled technologies array
      let tempShuffledTechnologies = [];
      for (let i = 0; i < shuffledTechnologies.length; i += 2) {
        tempShuffledTechnologies.push([
          shuffledTechnologies[i],
          shuffledTechnologies[i + 1],
        ]);
      }

      // Limit the length of tempShuffledTechnologies to match the length of technologies
      tempShuffledTechnologies = tempShuffledTechnologies.slice(
        0,
        technologies.length
      );
      console.log(tempShuffledTechnologies);
      setShuffledTechnologies(tempShuffledTechnologies);

      // Use the original technologies array for the initial rankings
      let initialRankings = {};
      technologies.forEach((tech) => {
        initialRankings[tech.title] = {
          descriptors: [],
          wins: 0,
          losses: 0,
          ties: 0,
          opponents: {}, // Keep track of wins, losses, and ties against each opponent
        };
      });
      setRankings(initialRankings);
    }
  }, [technologies]);

  useEffect(() => {
    if (currentPairIndex >= technologies.length / 2) {
      setGameOver(true);
    }
  }, [currentPairIndex, technologies.length]);

  useEffect(() => {
    calculateProgress();
  }, [currentPairIndex]);

  const calculateProgress = () => {
    const totalPairs = Math.floor(technologies.length / 2);
    const currentProgress = (currentPairIndex / totalPairs) * 100;
    console.log(currentProgress);
    setProgress(currentProgress);
  };

  const handleChoice = (chosenIndex) => {
    // Adjustments to handle new shuffledTechnologies format
    if (selectedCard !== null) {
      return; // If a card is already selected, do nothing
    }

    const chosenCard = chosenIndex % 2 === 0 ? 0 : 1;

    setSelectedCard(shuffledTechnologies[currentPairIndex][chosenCard]);
    setUnselectedCard(
      shuffledTechnologies[currentPairIndex][(chosenCard + 1) % 2]
    );

    const selectedPercent = Math.floor(Math.random() * 100);
    const unselectedPercent = 100 - selectedPercent;

    setSelectedPercent(selectedPercent);
    setUnselectedPercent(unselectedPercent);
    setSelectionMade(true);
  };
  const renderTechnologyCard = (index) => {
    const tech = shuffledTechnologies[currentPairIndex][index];
    const percent = {
      selectedCard: selectedPercent,
      unselectedCard: unselectedPercent,
    };

    return (
      <TechnologyCard
        key={tech.title}
        tech={tech}
        handleChoice={handleChoice}
        index={index}
        percent={percent}
        selectionMade={selectionMade}
      />
    );
  };

  const handleDescriptorSelection = (descriptor) => {
    setSelectedDescriptors((prevDescriptors) => {
      let newDescriptors;
      if (prevDescriptors.includes(descriptor)) {
        newDescriptors = prevDescriptors.filter((desc) => desc !== descriptor);
      } else {
        newDescriptors = [...prevDescriptors, descriptor];
      }

      // Check if we should move onto the next stage or finish this round
      if (newDescriptors.length === 2) {
        if (descriptorStage === "firstDescriptors") {
          console.log("update");
          setDescriptorStage("secondDescriptors");
          newDescriptors = [];
        } else if (descriptorStage === "secondDescriptors") {
          // Calculate results and proceed to next pair
          let updatedRankings = { ...rankings };
          const selectedTech = selectedCard.title;
          const unselectedTech = unselectedCard.title;

          // Update wins, losses, and opponents
          updatedRankings[selectedTech].wins += 1;
          updatedRankings[unselectedTech].losses += 1;
          updatedRankings[selectedTech].opponents[unselectedTech] =
            (updatedRankings[selectedTech].opponents[unselectedTech] || 0) + 1;
          updatedRankings[unselectedTech].opponents[selectedTech] =
            (updatedRankings[unselectedTech].opponents[selectedTech] || 0) - 1;

          // Update the descriptors
          updatedRankings[selectedTech].descriptors.push(...newDescriptors);

          setRankings(updatedRankings);
          setSelectedDescriptors([]);
          setSelectedCard(null);
          setUnselectedCard(null);
          setCurrentPairIndex(currentPairIndex + 1);
          setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
          setSelectionMade(false);

          // Now the effect that triggers game over will run if necessary
          newDescriptors = [];
        }
      }
      return newDescriptors;
    });
  };

  const handleSkip = () => {
    console.log("skip");
    let updatedRankings = { ...rankings };
    const firstTech = shuffledTechnologies[currentPairIndex][0].title;
    const secondTech = shuffledTechnologies[currentPairIndex][1].title;

    // Update ties and opponents
    updatedRankings[firstTech].ties += 1;
    updatedRankings[secondTech].ties += 1;
    updatedRankings[firstTech].opponents[secondTech] =
      updatedRankings[firstTech].opponents[secondTech] || 0;
    updatedRankings[secondTech].opponents[firstTech] =
      updatedRankings[secondTech].opponents[firstTech] || 0;

    setRankings(updatedRankings);
    setSelectedDescriptors([]);
    setSelectedCard(null);
    setUnselectedCard(null);
    setCurrentPairIndex(currentPairIndex + 1);
    setDescriptorStage("firstDescriptors"); // Reset the descriptor stage
    setSelectionMade(false);
  };

  return (
    <div className="pairwise-game">
      <div className="progress-bar">
        <div
          className="progress-bar-inner"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {!gameOver && (
        <>
          <h2>
            Which technology would you prefer to be used on you or your loved
            ones?
          </h2>

          <div className="technology-pair">
            {currentPairIndex < shuffledTechnologies.length && (
              <>
                {renderTechnologyCard(0)}
                {renderTechnologyCard(1)}
              </>
            )}
            {selectedCard !== null && (
              <div className="descriptors">
                <h3>How would you describe in 2 words {selectedCard.title}?</h3>
                <div className="selected-card-descriptors">
                  <div className="bad-descriptors">
                    <div role="img" aria-label="sad-face">
                      😔
                    </div>
                    {descriptors[descriptorStage]
                      .slice(0, 5)
                      .map((descriptor, idx) => (
                        <Button
                          key={idx}
                          text={descriptor}
                          onClick={() => handleDescriptorSelection(descriptor)}
                          className={
                            selectedDescriptors.includes(descriptor)
                              ? "descriptor-button selected"
                              : "descriptor-button"
                          }
                        />
                      ))}
                  </div>
                  <div className="good-descriptors">
                    <div role="img" aria-label="happy-face">
                      😄
                    </div>
                    {descriptors[descriptorStage]
                      .slice(5)
                      .map((descriptor, idx) => (
                        <Button
                          key={idx}
                          text={descriptor}
                          onClick={() => handleDescriptorSelection(descriptor)}
                          className={
                            selectedDescriptors.includes(descriptor)
                              ? "descriptor-button selected"
                              : "descriptor-button"
                          }
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button text="Skip" onClick={handleSkip} />
        </>
      )}
      {gameOver && <Rankings rankings={rankings} finishGame={finishGame} />}
    </div>
  );
};

export default PairwiseGame;
