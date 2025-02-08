import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./style/InstaAuthLogin.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { CopyAll } from "@mui/icons-material";

const EXAMPLE_MAIN_URL = window.location.origin;

const InstaAuthLogin = ({ moveToNextStep = () => {} }) => {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [errors, setErrors] = useState({});

  const { company_id, application_id } = useParams();

  const handleConnect = async () => {
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

  const URL = EXAMPLE_MAIN_URL + "/company";

  const handleCopyUrl = async () => {
    try {
      await navigator?.clipboard?.writeText(URL);
      toast("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="insta-auth-login">
      <div className="guide">
        <h2>Instagram Authentication</h2>
        <div className="parent-conatiner">
          <div className="guide-conatiner">
            <ol>
              <li>
                Create facebook developers account and create an App inside it
              </li>
              <li>Create a Facebook business account with a public page</li>
              <li>
                Create an Instagram business account, link this account to
                facebook page
              </li>
              <li>Get the Application ID and Application Secret</li>
            </ol>

            <strong>Important:</strong>
            <div className="note-container">
              <span>{URL}</span>
              <CopyAll className="copy-icon" onClick={handleCopyUrl} />
            </div>

            <ol>
              <li>Add this URL to your whitelisted URLs</li>
              <li>
                Go to your account:{" "}
                <a href="https://developers.facebook.com/" target="_blank">
                  Facebook Developer Portal
                </a>
              </li>
              <li>Navigate to the **Facebook Login for Business** section</li>
              <li>
                Paste the copied code into the **Valid OAuth Redirect URIs**
                text field
              </li>
              <li>
                <strong>Important:</strong> Click on **Save Changes**
              </li>
            </ol>
          </div>

          <form>
            <div className="form-group">
              <TextField
                label="Client Id"
                variant="outlined"
                fullWidth
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                error={!!errors?.clientId}
                helperText={errors?.clientId}
              />
            </div>
            <div className="form-group">
              <TextField
                label="Client Secret"
                variant="outlined"
                fullWidth
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                error={!!errors?.clientSecret}
                helperText={errors?.clientSecret}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleConnect}
            >
              Connect to Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstaAuthLogin;
