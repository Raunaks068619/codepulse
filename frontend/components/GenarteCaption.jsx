import { Autocomplete, Box, Button, Chip, CircularProgress, List, ListItem, ListItemText, TextField } from "@mui/material";
import InstaPost from "./InstaPost";
import "./style/GenerateCaption.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { defaultHashtags } from "../constants";
import axios from "axios";

const GenerateCaption = ({
  authData,
  progressData,
  handleSubmit = () => { },
  moveToNextStep = () => { },
  moveToBackStep = () => { },
}) => {
  const randomHashtag = defaultHashtags[Math.floor(Math.random() * defaultHashtags.length)];

  const [productDescription, setProductDescription] = useState("");
  const [productCaption, setProductCaption] = useState("");
  const [productHashtag, setProductHashtag] = useState([randomHashtag?.title]);


  console.log({ progressData });


  useEffect(() => {
    setProductDescription(progressData?.selectedProduct?.description);
  }, [progressData]);

  const storeAndmoveToNextStep = () => {
    handleSubmit({
      productDescription,
      productCaption,
      productHashtag,
    });
  };


  const getCaption = async () => {
    try {
      const response = await axios.post('/api/generate-captions', { description: productDescription });

      console.log({ caption: response.data.caption });
      console.log({ hashtag: JSON.parse(response.data.hashtags) });

      setProductCaption(response.data.caption)
      setProductHashtag(productHashtag, JSON.parse(response.data.hashtags));

    } catch (error) {
      console.error('Error fetching caption:', error);
    }
  };

  useEffect(() => {
    if (progressData?.productCaption) {
      setProductCaption(progressData?.productCaption)
    }
    if (progressData?.productHashtag) {
      setProductHashtag(progressData?.productHashtag);
    }
    else {
      getCaption();
    }
  }, [productDescription])

  return (
    <div className="generate-caption-conatiner">
      <div className="caption-container">
        <div className="caption-description-container">
          <div>
            <div className="title-container">
              <span className="back-icon-container" onClick={() => {
                moveToBackStep({
                  productCaption: null,
                  productHashtag: null,
                  ctaTitle: null,
                  budgetAmount: null,
                  minAge: null,
                  maxAge: null
                });
              }}>
                <ArrowBackIcon />
              </span>
              <div className="sales-channel-title">
                Fill Details for Instagram Post
              </div>
            </div>
            <div className="caption-description">
              <Box sx={{ mb: 3 }}>
                {progressData?.selectedProduct?.description && (
                  <div>
                    <p className="desc-title">Product Description</p>
                    <span
                      className="description-value"
                      dangerouslySetInnerHTML={{
                        __html: progressData?.selectedProduct?.description,
                      }}
                    ></span>
                  </div>
                )}
              </Box>

              {/* <TextField
              id="post-caption"
              label="Post Description"
              multiline
              rows={2}
              defaultValue={progressData?.selectedProduct?.description || ""}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            /> */}

              {productCaption && productHashtag ? <>
                <TextField
                  id="post-caption"
                  label="Post Caption"
                  multiline
                  maxRows={5}
                  sx={{ mb: 2 }}
                  defaultValue={progressData?.selectedProduct?.description || ""}
                  value={productCaption}
                  onChange={(e) => setProductCaption(e.target.value)}
                />

                <Autocomplete
                  multiple
                  id="tags-filled"
                  options={defaultHashtags.map((option) => option.title)}
                  defaultValue={productHashtag}
                  freeSolo
                  onChange={(event, newValues) => {
                    console.log({
                      newValues,
                    });
                    setProductHashtag(newValues);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          variant="outlined"
                          label={option}
                          key={key}
                          {...tagProps}
                        />
                      );
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Post Hashtag"
                      placeholder="Favorites"
                    />
                  )}
                /></> : <Box sx={{ height: "200px", display: "flex", alignItems: "center", justifyContent: 'center', width: '100%' }}>
                <CircularProgress /></Box>}
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
        <div className="instagram-post-preview-container">
          <InstaPost
            imageUrl={progressData?.selectedImage?.url}
            profileImageUrl={authData?.instaAccountData?.profile_picture_url}
            accountName={authData?.instaAccountData?.username}
            caption={productCaption}
            hashtag={productHashtag?.join(" ") || ""}
          />
        </div>
      </div>
    </div >
  );
};

export default GenerateCaption;
