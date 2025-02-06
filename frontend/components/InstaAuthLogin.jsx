import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './style/InstaAuthLogin.css';

const InstaAuthLogin = ({
    moveToNextStep = () => {}
}) => {
  const [applicationId, setApplicationId] = useState('');
  const [applicationSecret, setApplicationSecret] = useState('');

  const handleConnect = () => {
    console.log('Application ID:', applicationId);
    console.log('Application Secret:', applicationSecret);

    // Call API to store data in DB
 
    moveToNextStep();
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
              label="Application ID"
              variant="outlined"
              fullWidth
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <TextField
              label="Application Secret"
              variant="outlined"
              fullWidth
              value={applicationSecret}
              onChange={(e) => setApplicationSecret(e.target.value)}
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
