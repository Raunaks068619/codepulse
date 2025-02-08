import React, { useState } from 'react';
import './style/Test.css';

const InstagramAuthForm = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  
  const redirectUrl = "Https://Copied-Meetup-Maiden-Qualify.Trycloudflare.Com/Company";
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(redirectUrl);
  };
  
  const steps = [
    "Create facebook developers account and create an App inside it",
    "Create a Facebook business account with a public page",
    "Create an Instagram business account, link this account to facebook page",
    "Get the Application ID and Application Secret"
  ];

  const importantSteps = [
    "Add this URL to your whitelisted URLs",
    "Go to your account: Facebook Developer Portal",
    'Navigate to the "Facebook Login for Business" section',
    'Paste the copied code into the "Valid OAuth Redirect URIs" text field',
    'Click on "Save Changes"'
  ];

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>Instagram Authentication</h1>
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
                  <p>{redirectUrl}</p>
                  <button className="copy-button" onClick={handleCopyUrl}>
                    Copy
                  </button>
                </div>
                
                <ol className="steps-list">
                  {importantSteps.map((step, index) => (
                    <li key={index}>
                      {step.includes("Facebook Developer Portal") ? (
                        <>
                          Go to your account:{' '}
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
                  <label htmlFor="clientId">Client Id</label>
                  <input
                    id="clientId"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your client ID"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientSecret">Client Secret</label>
                  <input
                    id="clientSecret"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Enter your client secret"
                  />
                </div>

                <button className="connect-button">
                  Connect to Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstagramAuthForm;