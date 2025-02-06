import { Box, TextField, Button, Typography, TextareaAutosize } from "@mui/material";
import InstaPost from "./InstaPost";
import "./style/GenerateCaption.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useParams } from "react-router-dom";

const PublishPost = ({
  moveToNextStep = () => { },
  moveToBackStep = () => { },
}) => {

  const { company_id, application_id } = useParams()
  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/instagram/post', {
        imageUrl: 'https://cdn.pixelbin.io/v2/potlee/original/public/banners/is_now_settle.png',
        caption: "TESTT asdfasdfasdfasdfsdf TESTT",
        company_id,
        application_id,
        createAd: true
      });

      if (response.data.success) {
        console.log({ response });

        // setSuccess(true);
        // moveToNextStep();
      }
    } catch (err) {
      console.log(err.response?.data?.message || 'Failed to publish post');;

    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", justifyContent: 'space-between', alignItems: 'center', gap: "30px" }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Instagram Account Name:</Typography>
            <TextField variant="outlined" name="accountName" fullWidth />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Business Account ID:</Typography>
            <TextField variant="outlined" name="businessAccountId" fullWidth />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Caption:</Typography>
            <TextareaAutosize minRows={4} value={'TESTT asdfasdfasdfasdfsdf TESTT'} name="caption" style={{ width: '100%' }} />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">Image URL:</Typography>
            <TextField variant="outlined" name="imageURL" value={'https://cdn.pixelbin.io/v2/potlee/original/public/banners/is_now_settle.png'} fullWidth />
          </Box>
          <Button onClick={handleSubmit} variant="contained" color="primary" type="submit">Post to Instagram</Button>
        </Box>
      </Box>
      <div className="instagram-post-previw-container">
        <InstaPost />
      </div>
    </Box>
  );
};

export default PublishPost;
