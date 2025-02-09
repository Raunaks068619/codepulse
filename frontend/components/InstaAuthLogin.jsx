import React, { useState } from "react";
import "./style/InstaAuthLogin.css";
import CustomInput from "./CustomInput";
import { ContentCopy, Key, Person } from "@mui/icons-material";
import CustomButton from "./CustomButton";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const EXAMPLE_MAIN_URL = window.location.origin;

const InstaAuthLogin = () => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmiting, setIsSubmiting] = useState(false);

  const { company_id, application_id } = useParams();

  const steps = [
    "Create facebook developers account and create an App inside it",
    "Create a Facebook business account with a public page",
    "Create an Instagram business account, link this account to facebook page",
    "Get the Application ID and Application Secret",
  ];

  const importantSteps = [
    "Add this URL to your whitelisted URLs",
    "Go to your account: Facebook Developer Portal",
    'Navigate to the "Facebook Login for Business" section',
    'Paste the copied code into the "Valid OAuth Redirect URIs" text field',
    'Click on "Save Changes"',
  ];

  const handleConnect = async () => {
    setIsSubmiting(true);
    try {
      console.log("Application ID:", clientId);
      console.log("Application Secret:", clientSecret);

      const err = validateInput();
      if (Object.keys(err).length > 0) {
        setErrors(err);
        return;
      }

      setErrors({});

      // Call API to store data in DB
      const res = await axios.post("/api/auth/login", {
        company_id,
        application_id,
        client_id: clientId || "",
        client_secret: clientSecret || "",
      });

      window.parent.location.href = res?.data?.authUrl;
      // moveToNextStep();
      // toast("login successful");
    } catch (err) {
      console.log(err);
      toast(err.message || "Opps ! Error while login with meta");
    } finally {
      setIsSubmiting(false);
    }
  };

  const validateInput = () => {
    const errors = {};
    if (!clientId) {
      errors.clientId = "Client ID is required";
    }

    if (!clientSecret) {
      errors.clientSecret = "Client Secret is required";
    }

    return errors;
  };

  const rediretcURL = EXAMPLE_MAIN_URL + "/company";

  const handleCopyUrl = async () => {
    try {
      await navigator?.clipboard?.writeText(rediretcURL);
      toast("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Attach Instagram Account</h1>
        </div>

        <div className="content">
          <div className="split-layout">
            {/* Left Side - Instructions */}
            <div className="left-side">
              {/* Initial Steps */}
              <div className="section">
                <h3>Initial Setup:</h3>
                <ol className="steps-list">
                  {steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Important Section */}
              <div className="section">
                <h3>Important:</h3>
                <div className="url-box">
                  <p>{rediretcURL}</p>
                  <ContentCopy className="copy-icon" onClick={handleCopyUrl} />
                </div>

                <ol className="steps-list">
                  {importantSteps.map((step, index) => (
                    <li key={index}>
                      {step.includes("Facebook Developer Portal") ? (
                        <>
                          Go to your account:{" "}
                          <a href="https://developers.facebook.com">
                            Facebook Developer Portal
                          </a>
                        </>
                      ) : (
                        step
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="right-side">
              <div className="form-container">
                <div className="form-group">
                  <CustomInput
                    label="Client ID"
                    placeholder="Enter your client ID"
                    icon={Person}
                    name="clientId"
                    onChange={(e) => setClientId(e.target.value)}
                    value={clientId}
                    error={errors?.clientId}
                    helperText={errors?.clientId}
                  />
                </div>

                <div className="form-group">
                  <CustomInput
                    label="Client Secret"
                    type="password"
                    placeholder="Enter your client Secret"
                    icon={Key}
                    value={clientSecret}
                    name="clientSecret"
                    onChange={(e) => setClientSecret(e.target.value)}
                    error={errors?.clientSecret}
                    helperText={errors?.clientSecret}
                  />
                </div>

                <CustomButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleConnect}
                  loading={isSubmiting}
                >
                  Connect to Account
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstaAuthLogin;
