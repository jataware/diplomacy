import React, { useEffect, useState } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const tones = ["Haughty", "Objective", "Obsequious", "Relaxed", "Urgent"];

// eslint-disable-next-line react/prop-types
const ToneToggle = ({ onToneChange, submitted }) => {
  const [selectedTone, setSelectedTone] = useState('');

  useEffect(() => {
    // every time the submitted flag changes in any way, reset the tone
    setSelectedTone('');
  }, [submitted]);

  const handleToneChange = (event, newTone) => {
    setSelectedTone(newTone);
    onToneChange(newTone);
  };

  return (
    <ToggleButtonGroup
      value={selectedTone}
      exclusive
      onChange={handleToneChange}
    >
      {tones.map((name) =>
        <ToggleButton key={name} value={name}>
          {name}
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

export default ToneToggle;

