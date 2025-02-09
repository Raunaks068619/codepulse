import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import "./style/PostPublicSuccessModal.css";
import { Check, Facebook, Instagram } from "@mui/icons-material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const PostPublicSuccessModal = ({
  showModal = false,
  paramaLink = "https://www.instagram.com/p/DFxEsk2B_8-/",
  adAccountLink = "",
  handleFinalSubmit = () => { }
}) => {
  const handleClose = (event, reason) => {
    // Prevent closing on backdrop click or escape key
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    // setOpen(false);
  };
  const containerStyle = {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',

  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    textAlign: 'center'
  };

  const imageStyle = {
    width: '120px',
    height: '120px',
    marginBottom: '1.5rem'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#333'
  };

  const messageStyle = {
    fontSize: '16px',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: 1.5
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px',
    margin: '0 auto'
  };

  const baseButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
    color: 'white',
    transition: 'opacity 0.2s'
  };

  const instagramButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(45deg, #833AB4, #FD1D1D)'
  };

  const facebookButtonStyle = {
    ...baseButtonStyle,
    background: '#1877F2'
  };

  const gotItButtonStyle = {
    ...baseButtonStyle,
    background: '#2E7D32'
  };


  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      onBackdropClick={(e) => {
        e.preventDefault();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {/* <DialogTitle id="alert-dialog-title">Select Product Image</DialogTitle> */}
      <DialogContent>
        <div style={containerStyle}>
          <div style={cardStyle}>
            <DotLottieReact
              style={{
                width: "60%",
                margin: "0 auto"
              }}
              src="https://cdn.pixelbin.io/v2/potlee/original/public/Animation_-_1739085911030.json"
              autoplay
            />

            <h1 style={titleStyle}>Congratulations!</h1>

            <p style={messageStyle}>
              Hurray! Your ad campaign has been created successfully and will be activated shortly after Meta's review.
            </p>

            <div style={buttonContainerStyle}>
              <Button
                variant="contained"
                sx={{
                  mt: 3,
                  background:
                    "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)",
                  textTransform: 'none',
                }}
                onClick={() => window?.open(paramaLink, "_blank")}
                startIcon={<Instagram sx={{ fill: "white" }} />}
              >
                <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">View on Instagram</Typography>
              </Button>

              <Button
                variant="contained"
                onClick={() => window?.open(adAccountLink, "_blank")}
                startIcon={<Facebook sx={{ fill: "white" }} />}
                sx={{ textTransform: 'none', }}
              >
                <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">Facebook AD Manager</Typography>
              </Button>

              <Button
                variant="text"
                // color="success"
                fullWidth
                startIcon={<Check sx={{ fill: "white" }} />}
                onClick={handleFinalSubmit}
                autoFocus
              >
                Okay Got it
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      {/* <DialogActions>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<Check sx={{ fill: "white" }} />}
          onClick={handleFinalSubmit}
          autoFocus
        >
          Okay Got it
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};
