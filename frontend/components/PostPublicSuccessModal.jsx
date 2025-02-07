import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import "./style/PostPublicSuccessModal.css";
import { Check, Facebook, Instagram } from "@mui/icons-material";

export const PostPublicSuccessModal = ({
  showModal = false,
  paramaLink = "https://www.instagram.com/p/DFxEsk2B_8-/",
  adAccountLink = "",
  handleFinalSubmit = () => {}
}) => {
  const handleClose = (event, reason) => {
    // Prevent closing on backdrop click or escape key
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
    // setOpen(false);
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
        <div className="success-container">
          <img
            src="https://cdn.pixelbin.io/v2/potlee/original/images-removebg-preview.png"
            alt="congratulations"
          ></img>
        </div>

        <h2 className="title">Congratulations!</h2>
        <DialogContentText
          id="alert-dialog-description"
          className="title-conatiner"
        >
            Hurray! Your ad campaign has been created successfully and will be activated shortly after Meta's review.
        </DialogContentText>

        <div className="action-conatiner">
          <Button
            variant="contained"
            sx={{
              background:
                "linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)",
            }}
            onClick={() => window?.open(paramaLink, "_blank")}
            startIcon={<Instagram sx={{fill: "white"}} />}
          >
            View on Instagram
          </Button>

          <Button
            variant="contained"
            onClick={() => window?.open(adAccountLink, "_blank")}
            startIcon={<Facebook sx={{fill: "white"}} />}
          >
            Favcebook Ad Manager
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<Check sx={{fill: "white"}} />}
          onClick={handleFinalSubmit}
          autoFocus
        >
          Okay Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};
