import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import InstaPost from "./InstaPost";
import "./style/GenerateCaption.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./style/PublishPost.css";
import { CTAtitles } from "../constants";

const PublishPost = ({
  authData,
  progressData,
  handleSubmit = () => {},
  moveToNextStep = () => {},
  moveToBackStep = () => {},
}) => {
  const { company_id, application_id } = useParams();
  const [catTitle, setCatTitle] = useState("");
  const [budgetAmount, setBudgetAmount] = useState();
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // setProductDescription(progressData?.selectedProduct?.description);
  }, [progressData]);

  const storeAndmoveToNextStep = async () => {
    try {
      const err = validateFields();
      if (Object(err).keys.length > 0) {
        setErrors(err);
        return;
      }

      setErrors(null);

      const payload = {
        imageUrl: progressData?.selectedImage?.url,
        caption:
          progressData?.selectedImage?.productCaption +
          progressData?.selectedImage?.productHashtag.join(" "),
        company_id,
        application_id,
        createAd: false,
      };
      const response = await axios.post("/api/instagram/post", payload);

      if (response?.data?.success) {
        console.log({ response });
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to publish post");
    }
  };

  const validateFields = () => {
    const error = {};
    if (!catTitle) {
      error.catTitle = "Cat Title is required";
    }

    if (!budgetAmount || budgetAmount < 87) {
      error.budgetAmount = "budget should be greater then ₹87.";
    }

    if (!minAge) {
      error.minAge = "Min age is required.";
    }

    if (!maxAge) {
      error.maxAge = "Max age is required.";
    }

    return error;
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
              <h3>Campign Data</h3>
              <FormControl fullWidth>
                <InputLabel id="cat-title-demo-label">CTA Title</InputLabel>
                <Select
                  labelId="cat-title-demo-label"
                  id="cat-title-demo"
                  label="CTA Title"
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                >
                  {CTAtitles?.map((CTAtitle, CTAtitleIndex) => {
                    return (
                      <MenuItem index={CTAtitleIndex} value={CTAtitle?.value}>
                        {CTAtitle?.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl sx={{ mt: 2 }} fullWidth>
                <InputLabel htmlFor="amount-budget">Amount</InputLabel>
                <OutlinedInput
                  id="amount-budget"
                  type="number"
                  min={87}
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  label="Amount"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="target-audiance-container">
              <h3>Target Audience</h3>

              <div className="age-conatiner">
                <TextField
                  id="min-age"
                  label="Min Age"
                  type="number"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />
                <TextField
                  id="max-age"
                  label="Max Age"
                  type="number"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="submit-container">
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={() => {
                const errs = validateFields();
                return Object.keys(errs)?.length > 0;
              }}
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
            caption={progressData?.productCaption}
            hashtag={progressData?.productHashtag?.join(" ") || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
