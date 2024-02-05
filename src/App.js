// App.js
import React, { useState, useRef, useEffect } from 'react';
import './App.css'; 

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedAudioFiles = JSON.parse(localStorage.getItem('audioFiles')) || [];
    const storedCurrentAudioIndex = JSON.parse(localStorage.getItem('currentAudioIndex'));

    if (storedAudioFiles.length > 0) {
      setAudioFiles(storedAudioFiles);
    }

    if (storedCurrentAudioIndex !== null && storedCurrentAudioIndex < storedAudioFiles.length) {
      setCurrentAudioIndex(storedCurrentAudioIndex);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('audioFiles', JSON.stringify(audioFiles));
    localStorage.setItem('currentAudioIndex', JSON.stringify(currentAudioIndex));
  }, [audioFiles, currentAudioIndex]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    if (files.some((file) => !file.type.startsWith('audio/'))) {
      setError('Please upload only audio files (e.g., mp3).');
    } else {
      setAudioFiles([...audioFiles, ...files]);
      setError(null);
    }
  };

  const handlePlay = () => {
    audioRef.current.play();
  };

  const handlePause = () => {
    audioRef.current.pause();
  };

  const handleNext = () => {
    setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  const handleTimeUpdate = () => {
    localStorage.setItem('currentPlaybackTime', JSON.stringify(audioRef.current.currentTime));
  };

  useEffect(() => {
    const lastPlaybackTime = JSON.parse(localStorage.getItem('currentPlaybackTime'));

    if (lastPlaybackTime !== null) {
      audioRef.current.currentTime = lastPlaybackTime;
      handlePlay();
    }
  }, [currentAudioIndex]);


  return (
    <div className="app-container">
      <div className="content-container">
        <h1 className="audio-player-name">Music Player</h1>
        <input type="file" accept="audio/*" multiple onChange={handleFileUpload}/>
      </div>
      {error && <div className="error-message">{error}</div>}
      <audio
        ref={audioRef}
        controls
        onEnded={handleNext}
        onTimeUpdate={handleTimeUpdate}
        src={audioFiles[currentAudioIndex] && URL.createObjectURL(audioFiles[currentAudioIndex])}
      />
      <div className="controls">
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleNext}>Next</button>
      </div>
      <div>
        <h2>Playlist</h2>
        <ul>
          {audioFiles.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;



