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
import urlJoin from "url-join";

const EXAMPLE_MAIN_URL = window.location.origin;

const PublishPost = ({
  authData,
  progressData,
  handleSubmit = () => {},
  moveToNextStep = () => {},
  moveToBackStep = () => {},
}) => {
  const { company_id, application_id } = useParams();
  const [ctaTitle, setCtaTitle] = useState("");
  const [budgetAmount, setBudgetAmount] = useState();
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [pdpLink, setPdpLink] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // setProductDescription(progressData?.selectedProduct?.description);
    if (progressData?.selectedProduct?.slug) {
      fetchPDPLink();
    }

    if (progressData?.ctaTitle) {
      setCtaTitle(progressData?.ctaTitle);
    }

    if (progressData?.budgetAmount) {
      setBudgetAmount(progressData?.budgetAmount);
    }

    if (progressData?.minAge) {
      setMinAge(progressData?.minAge);
    }

    if (progressData?.maxAge) {
      setMaxAge(progressData?.maxAge);
    }
  }, [progressData]);

  const fetchPDPLink = async () => {
    try {
      const { data } = await axios.get(
        urlJoin(
          EXAMPLE_MAIN_URL,
          `/api/products/${progressData?.selectedProduct?.slug}/application/${application_id}`
        ),
        {
          headers: {
            "x-company-id": company_id,
          },
        }
      );
      setPdpLink(data?.pdpURL || "");
    } catch (error) {
      console.error("Error fetching PDP Link", error);
    }
  };

  const storeAndmoveToNextStep = async () => {
    try {
      const errors = validateFields();
      if (Object(errors)?.keys?.length > 0) {
        setErrors(errors);
        return;
      }

      setErrors(null);

      const payload = {
        imageUrl: progressData?.selectedImage?.url,
        caption:
          progressData?.productCaption +
          progressData?.productHashtag?.join(" "),
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
    if (!ctaTitle) {
      error.ctaTitle = "Cat Title is required";
    }

    if (!budgetAmount || budgetAmount < 87) {
      error.budgetAmount = "budget should be greater then ₹87.";
    }

    if (!minAge) {
      error.minAge = "Min age is required.";
    }

    if (!maxAge) {
      error.maxAge = "Max age is required.";
    } else if (maxAge < minAge) {
      error.maxAge = "Max age should be greater then min age";
    }

    return error;
  };

  const isSubmitDisabled = Object.keys(validateFields())?.length > 0;

  return (
    <div className="generate-caption-conatiner">
      <div className="caption-container">
        <div className="caption-description-container">
          <div>
            <div className="title-container">
              <span
                className="back-icon-container"
                onClick={() => {
                  moveToBackStep({
                    ctaTitle,
                    budgetAmount,
                    minAge,
                    maxAge,
                  });
                }}
              >
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
                  value={ctaTitle}
                  onChange={(e) => setCtaTitle(e.target.value)}
                  hiddenLabel={errors?.ctaTitle}
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
                  hiddenLabel={errors?.budgetAmount}
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
                  hiddenLabel={errors?.minAge}
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
                  hiddenLabel={errors?.maxAge}
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
              disabled={isSubmitDisabled}
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
            caption={progressData?.productCaption}
            hashtag={progressData?.productHashtag?.join(" ") || ""}
            pdpLink={pdpLink}
            ctaButtonText={
              CTAtitles?.find((value) => value.value === ctaTitle)?.title
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
