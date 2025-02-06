import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./style/InstaAuthLogin.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const InstaAuthLogin = ({ moveToNextStep = () => {} }) => {
  const [clientId, setClientId] = useState("657917179960900");
  const [clientSecret, setClientSecret] = useState("208f341f4575f366d74a1d76002ddac4");
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
      toast(err.message || "Opps ! Error while login with meta")
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

  return (
    <div className="insta-auth-login">
      <div className="guide">
        <h2>Instagram Authentication</h2>
        <ol>
          <li>Create a Facebook business account with a public page</li>
          <li>Create an Instagram business account</li>
          <li>Connect the Facebook page and Instagram account</li>
          <li>Get the Application ID and Application Secret</li>
        </ol>
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
  );
};

export default InstaAuthLogin;
