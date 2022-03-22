import React, { useState } from 'react';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const tones = ["Haughty", "Objective", "Obsequious", "Relaxed", "Urgent"];

// eslint-disable-next-line react/prop-types
const ToneToggle = ({ onToneChange }) => {
  const [selectedTone, setSelectedTone] = useState('');

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

