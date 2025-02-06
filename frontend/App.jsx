import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import CustomStepper from "./components/CustomStepper.jsx";
import "./pages/style/app.css";
import InstaAuthLogin from "./components/InstaAuthLogin";
import ProductListing from "./components/ProductListing";
import GenerateCaption from "./components/GenarteCaption";
import PublishPost from "./components/PublishPost.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";
import Login from "./pages/Login.jsx";

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
  const [activeStep, setActiveStep] = useState(3);
  const [progressData, setProgressData] = useState({});
  const [secrets, setSecrets] = useState(null)
  const { company_id, application_id } = useParams


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
  }

  const getSecret = async () => {
    const res = await axios.get(`/api/secrets`, { params: { company_id, application_id } })
    if (res.status === 200) {
      console.log({ res });
      setSecrets(res.data.secrets)
      return res.data
    }
  }

  useEffect(() => {
    if (!secrets) {
      getSecret();
    }
  }, [company_id, application_id])

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
        return <PublishPost moveToBackStep={moveToBackStep} moveToNextStep={moveToNextStep} handleSubmit={handleSubmitAndStoreData} />;
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
