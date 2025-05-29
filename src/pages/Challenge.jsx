import React from 'react';
import { useLocation } from 'react-router-dom';

const Challenge = () => {
  const { state } = useLocation();
  const { challengeId, language, testMode, wordCount, timeDuration, opponent } = state || {};

  console.log('Challenge page loaded with state:', state); // Debug log

  return (
    <div style={{ padding: '20px', color: '#F4F4F5', fontFamily: '"Press Start 2P", monospace' }}>
      <h2>Challenge</h2>
      <p>Challenge ID: {challengeId || 'N/A'}</p>
      <p>Opponent: {opponent || 'N/A'}</p>
      <p>Language: {language || 'N/A'}</p>
      <p>Test Mode: {testMode || 'N/A'}</p>
      {testMode === 'wordBased' ? (
        <p>Word Count: {wordCount || 'N/A'}</p>
      ) : (
        <p>Duration: {timeDuration || 'N/A'}s</p>
      )}
      {/* Add typing area logic here */}
    </div>
  );
};

export default Challenge;