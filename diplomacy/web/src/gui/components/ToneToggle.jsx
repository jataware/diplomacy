import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ToggleButton from '@mui/material/ToggleButton';
import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

const ToggleButtonGroup = styled(MuiToggleButtonGroup)(({ theme }) => `
  flex-wrap: wrap;

  & .MuiToggleButtonGroup-grouped {
    margin: ${theme.spacing(0.5)};
    border: 0;
    border-radius: 0;
  }
`);

const tones = [
    'Objective', 'Urgent', 'Hostile', 'Friendly', 'Fearful',
    'Confident', 'Empathetic', 'Upset', 'Expert'
];

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

ToneToggle.propTypes = {
    onToneChange: PropTypes.func.isRequired,
    submitted: PropTypes.bool
}

export default ToneToggle;

