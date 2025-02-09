import React, { useEffect, useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import CustomStepper from "./components/CustomStepper.jsx";
import "./pages/style/app.css";
import InstaAuthLogin from "./components/InstaAuthLogin";
import ProductListing from "./components/ProductListing";
import GenerateCaption from "./components/GenarteCaption";
import { Toaster } from "sonner";
import { useParams } from "react-router-dom";
import axios from "axios";
import PublishPost from "./components/PublishPost";
import InstagramAuthForm from "./components/Test";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#2e31be", // Facebook blue
    },
    secondary: {
      main: "#2e31be", // Instagram pink
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
  const [pageLoading, setPageLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [progressData, setProgressData] = useState({});
  const [authData, setAuthData] = useState({
    isSellerAuthentiated: false,
    platformDomain: "https://platform.fynd.com",
    extensionId: "67a36d8bd215866dcb2da3ef",
  });
  const { company_id, application_id } = useParams();

  useEffect(() => {
    console.log("Progress data updated:", progressData);
  }, [progressData]);

  useEffect(() => {
    // fetchInstaUserAccount();
    fetchAuthData();
  }, [company_id, application_id]);

  const fetchAuthData = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`/api/secrets`, {
        params: { company_id, application_id },
      });
      console.log({ res });

      if (res.status === 200) {
        if (res?.data?.isSellerAuthentiated) {
          setActiveStep(1);
          // fetchInstaUserAccount();
        }

        setAuthData({
          ...(res?.data || {}),
        });
      }

      setPageLoading(false);
    } catch (err) {
      console.log("Fetch Auth Data", {
        err,
      });
      setPageLoading(false);
    }
  };

  // const fetchInstaUserAccount = async () => {
  //   try {
  //     const accountRes = await axios.get(`/api/instagram/account`, {
  //       params: { company_id, application_id },
  //     });

  //     setAuthData({
  //       ...authData,
  //       instaAccountData: accountRes?.data?.data || {},
  //     });
  //   } catch (err) {
  //     console.log("fetchInstaUserAccount :: ", err);
  //   }
  // };

  const moveToNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const moveToBackStep = (data) => {
    setProgressData({
      ...progressData,
      ...data
    });
    setActiveStep(activeStep - 1);
  };

  const handleSubmitAndStoreData = (data) => {
    setProgressData({
      ...progressData,
      ...data,
    });
    moveToNextStep();
  };

  const handleFinalSubmit = async () => {
    setProgressData({
      ...progressData,
      productDescription: null,
      productCaption: null,
      productHashtag: null,
      ctaTitle: null,
      budgetAmount: null,
      minAge: null,
      maxAge: null,
      pdpLink: null,
    });
    setActiveStep(1);
  }

  const PrepareStepContent = () => {
    switch (activeStep) {
      case 0:
      return <InstaAuthLogin moveToNextStep={moveToNextStep} />;
      case 1:

        // return <InstagramAuthForm />
        return <ProductListing handleSubmit={handleSubmitAndStoreData} />;
      case 2:
        return (
          <GenerateCaption
            authData={authData}
            progressData={progressData}
            moveToBackStep={moveToBackStep}
            moveToNextStep={moveToNextStep}
            handleSubmit={handleSubmitAndStoreData}
          />
        );
      case 3:
        return (
          <PublishPost
            authData={authData}
            progressData={progressData}
            moveToBackStep={moveToBackStep}
            moveToNextStep={moveToNextStep}
            handleSubmit={handleSubmitAndStoreData}
            handleFinalSubmit={handleFinalSubmit}
          />
        );
      default:
        return <InstaAuthLogin moveToNextStep={moveToNextStep} />;
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <div className="main-container">
        {pageLoading ? (
          <div className="loader-container">
            <CircularProgress />
          </div>
        ) : (
          <>
            <CustomStepper activeStep={activeStep} />
            <div className="content-container">
              <PrepareStepContent />
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
