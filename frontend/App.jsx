import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import CustomStepper from "./components/CustomStepper.jsx";
import "./pages/style/app.css";
import InstaAuthLogin from "./components/InstaAuthLogin";
import ProductListing from "./components/ProductListing";
import GenerateCaption from "./components/GenarteCaption";
import Login from "./pages/Login";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#1877F2", // Facebook blue
    },
    secondary: {
      main: "#E4405F", // Instagram pink
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [progressData, setProgressData] = useState({});

  const moveToNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const moveToBackStep = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmitAndStoreData = (data) => {
    setProgressData({
      ...progressData,
      ...data,
    });
    moveToNextStep();
  };

  const PrepareStepContent = () => {
    switch (activeStep) {
      case 0:
        return <InstaAuthLogin moveToNextStep={moveToNextStep} />;
      case 1:
        return <ProductListing handleSubmit={handleSubmitAndStoreData} />;
      case 2:
        return (
          <GenerateCaption
            progressData={progressData}
            moveToBackStep={moveToBackStep}
            moveToNextStep={moveToNextStep}
            handleSubmit={handleSubmitAndStoreData}
          />
        );
      case 3:
        return <div>Step 4</div>;
      default:
        return <div>Step 1</div>;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div className="main-container">
        <CustomStepper activeStep={activeStep} />
        <div className="content-container">
          <PrepareStepContent />
        </div>
      </div>

      {/* <Login /> */}
    </ThemeProvider>
  );
}

export default App;
