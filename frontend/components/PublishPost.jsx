import {
  Box,
  TextField,
  Button,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import InstaPost from "./InstaPost";
import "./style/GenerateCaption.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const PublishPost = ({
  authData,
  progressData,
  handleSubmit = () => {},
  moveToNextStep = () => {},
  moveToBackStep = () => {},
}) => {
  const { company_id, application_id } = useParams();
  const [productDescription, setProductDescription] = useState("");
  const [productCaption, setProductCaption] = useState("");
  const [productHashtag, setProductHashtag] = useState([]);

  useEffect(() => {
    setProductDescription(progressData?.selectedProduct?.description);
  }, [progressData]);

  const storeAndmoveToNextStep = async () => {
    try {
      const response = await axios.post("/api/instagram/post", {
        imageUrl:
          "https://cdn.pixelbin.io/v2/potlee/t.resize(h:1080,w:1080)/1200px-Square_Inc_-_Square_Logo.jpeg",
        caption: "TESTT asdfasdfasdfasdfsdf TESTT",
        company_id,
        application_id,
        createAd: false,
      });

      if (response.data.success) {
        console.log({ response });

        // setSuccess(true);
        // moveToNextStep();
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to publish post");
    }
  };

  return (
    <div className="generate-caption-conatiner">
      <div className="caption-container">
        <div className="caption-description-container">
          <div>
            <div className="title-container">
              <span className="back-icon-container" onClick={moveToBackStep}>
                <ArrowBackIcon />
              </span>
              <div className="sales-channel-title">
                Fill the ad campaign details
              </div>
            </div>
            <div className="campaign-details-conatainer">
              <TextField
                id="post-caption"
                label="CTA Title"
                multiline
                rows={2}
                defaultValue={progressData?.selectedProduct?.description || ""}
                value={productCaption}
                onChange={(e) => setProductCaption(e.target.value)}
              />

              <TextField
                id="post-caption"
                label="Budget"
                multiline
                rows={2}
                defaultValue={progressData?.selectedProduct?.description || ""}
                value={productCaption}
                onChange={(e) => setProductCaption(e.target.value)}
              />

              <p>PDP Link</p>
            </div>
            <div className="target-audiance-container">
              <TextField
                id="  "
                label="Post Caption"
                multiline
                rows={2}
                defaultValue={progressData?.selectedProduct?.description || ""}
                value={productCaption}
                onChange={(e) => setProductCaption(e.target.value)}
              />
            </div>
          </div>
          <div className="submit-container">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={
                !productCaption || !productHashtag || productHashtag.length <= 0
              }
              onClick={storeAndmoveToNextStep}
            >
              Next
            </Button>
          </div>
        </div>
        <div className="instagram-post-previw-container">
          <InstaPost
            imageUrl={progressData?.selectedImage?.url}
            profileImageUrl={authData?.instaAccountData?.profile_picture_url}
            accountName={authData?.instaAccountData?.username}
            caption={productCaption}
            hashtag={productHashtag?.join(" ") || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
