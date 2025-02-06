import { Autocomplete, Button, Chip, TextField } from "@mui/material";
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
  const [productDescription, setProductDescription] = useState("");
  const [productCaption, setProductCaption] = useState("");
  const [productHashtag, setProductHashtag] = useState([defaultHashtags[13].title]);

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


    } catch (error) {
      console.error('Error fetching caption:', error);
    }
  };

  useEffect(() => {
    getCaption();
  }, [productDescription])


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
                Fill Details for Instagram Post
              </div>
            </div>
            <div className="caption-description">
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

              {/* <TextField
              id="post-caption"
              label="Post Description"
              multiline
              rows={2}
              defaultValue={progressData?.selectedProduct?.description || ""}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            /> */}

              <TextField
                id="post-caption"
                label="Post Caption"
                multiline
                rows={2}
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

export default GenerateCaption;
