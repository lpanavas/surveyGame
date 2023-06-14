import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import StoryGamePage from "./pages/StoryGamePage";
import structure from "./data/structure.json";
import "./components/styles/App.css";

function App() {
  const [showGame, setShowGame] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentKey, setCurrentKey] = useState(structure.order[0]);

  useEffect(() => {
    setCurrentKey(structure.order[currentPosition]);
  }, [currentPosition]);

  const isCurrentPositionGame = Object.keys(structure.games).includes(
    currentKey
  );
  const isCurrentPositionStory = Object.keys(structure.stories).includes(
    currentKey
  );

  const finishGameOrStory = (chosenOptionIndex, chosenDescriptors) => {
    if (isCurrentPositionGame || isCurrentPositionStory) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  const currentPath = isCurrentPositionStory
    ? structure.stories[currentKey].path
    : structure.games[currentKey].path;

  const handleStartGame = () => {
    setShowGame(true);
  };

  return (
    <div className="app">
      {showGame ? (
        <StoryGamePage
          storyPath={currentPath}
          finish={finishGameOrStory}
          prompt={
            isCurrentPositionGame ? structure.games[currentKey].prompt : null
          }
          isStory={isCurrentPositionStory}
        />
      ) : (
        <LandingPage onStartGame={handleStartGame} />
      )}
    </div>
  );
}

export default App;
