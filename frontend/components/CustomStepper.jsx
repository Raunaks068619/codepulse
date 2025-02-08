import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import InstagramIcon from '@mui/icons-material/Instagram';
import ImageIcon from '@mui/icons-material/Image';
import CreateIcon from '@mui/icons-material/Create';
import PublishIcon from '@mui/icons-material/Publish';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

// Custom Connector Styling
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, #405DE6 0%, #5851DB 50%, #833AB4 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, #405DE6 0%, #5851DB 50%, #833AB4 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
}));

// Custom Step Icon Styling
const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          'linear-gradient(136deg, #405DE6 0%, #5851DB 50%, #833AB4 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          'linear-gradient(136deg, #405DE6 0%, #5851DB 50%, #833AB4 100%)',
      },
    },
  ],
}));

// Custom Step Icon Component
function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <InstagramIcon />,
    2: <ImageIcon />,
    3: <CreateIcon />,
    4: <PublishIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

// Instagram Post Stepper Component
export default function CustomStepper({ activeStep = 0 }) {
  const steps = [
    "Attach Instagram Account",
    "Select Product & Image", 
    "Create Caption & Hashtag",
    "Publish Post"
  ];

  return (
    <Stack sx={{ width: '100%' }} spacing={4}>
      <Stepper 
          alternativeLabel
          activeStep={activeStep} 
          connector={<ColorlibConnector />}
        >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  );
}