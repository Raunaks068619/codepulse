import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormHelperText,
  IconButton,
  Typography,
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
import { Launch } from "@mui/icons-material";
import { PostPublicSuccessModal } from "./PostPublicSuccessModal";

const EXAMPLE_MAIN_URL = window.location.origin;

const PublishPost = ({
  authData,
  progressData,
  handleSubmit = () => {},
  moveToNextStep = () => {},
  moveToBackStep = () => {},
  handleFinalSubmit = () => {}
}) => {
  const { company_id, application_id } = useParams();
  const [ctaTitle, setCtaTitle] = useState("");
  const [budgetAmount, setBudgetAmount] = useState();
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [pdpLink, setPdpLink] = useState("");
  const [errors, setErrors] = useState({});
  const [successResponse, setSuccessResponse] = useState({});
  const [showModal, setShowModal] = useState(true);

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
      const errors = validateFields({
        ctaTitleLocal: ctaTitle,
        budgetAmountLocal: budgetAmount,
        minAgeLocal: minAge,
        maxAgeLocal: maxAge,
      });
      if (Object(errors)?.keys?.length > 0) {
        setErrors(errors);
        return;
      }

      setErrors(null);

      // const response = await axios.post("/api/instagram/post", payload);
      const response = await axios.post("/api/instagram/post", {
        imageUrl: progressData?.selectedImage?.url,
        caption:
          progressData?.productCaption +
          progressData?.productHashtag?.join(" "),
        company_id,
        application_id,
        createAd: true,
        adConfig: {
          cta_type: ctaTitle,
          daily_budget: Number(budgetAmount) * 100, // in rupees
          campaign_name: "CODEPULSE_FYND_AD_CAMPAIGN",
          website_url: pdpLink,
          targeting: {
            age_min: Number(minAge),
            age_max: Number(maxAge),
            countries: ["IN"],
          },
        },
      });

      if (response.data.success) {
        console.log({ response });

        setSuccessResponse(response?.data);
        setShowModal(true);
      }

      if (response?.data?.success) {
        console.log({ response });
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to publish post");
    }
  };

  const handleOnChange = (event, name) => {
    const value = event?.target?.value;
    let errors = {};
    switch (name) {
      case "ctaTitle":
        setCtaTitle(value);
        // errors = validateFields({
        //   ctaTitleLocal: value,
        // });
        break;
      case "budgetAmount":
        setBudgetAmount(value);
        // errors = validateFields({
        //   budgetAmountLocal: value,
        // });
        break;
      case "minAge":
        setMinAge(value);
        // errors = validateFields({
        //   minAgeLocal: value,
        // });
        break;
      case "maxAge":
        setMaxAge(value);
        // errors = validateFields({
        //   maxAgeLocal: value,
        // });
        break;
      default:
        break;
    }

    setErrors({ ...errors });
  };

  const validateFields = ({
    ctaTitleLocal = ctaTitle,
    budgetAmountLocal = budgetAmount,
    minAgeLocal = minAge,
    maxAgeLocal = maxAge,
  }) => {
    const error = {};
    if (!ctaTitleLocal) {
      error.ctaTitle = "Cat Title is required";
    }

    if (!budgetAmountLocal || budgetAmountLocal < 87) {
      error.budgetAmount = "budget should be greater then ₹87";
    }

    if (!minAgeLocal) {
      error.minAge = "Min age is required.";
    } else if (minAgeLocal < 18) {
      error.minAge = "Min age should be geater then 18";
    }

    if (!maxAgeLocal) {
      error.maxAge = "Max age is required.";
    } else if (maxAgeLocal < minAgeLocal) {
      error.maxAge = "Max age should be greater then min age";
    }

    return error;
  };

  const isSubmitDisabled =
    Object.keys(
      validateFields({
        ctaTitleLocal: ctaTitle,
        budgetAmountLocal: budgetAmount,
        minAgeLocal: minAge,
        maxAgeLocal: maxAge,
      })
    )?.length > 0;

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
                Fill the ad campaign details for
                <span className="pdp-link">
                  {progressData?.selectedProduct?.name}
                  <IconButton onClick={() => window?.open(pdpLink, "_blank")}>
                    <Launch color="primary" />
                  </IconButton>
                </span>
              </div>
            </div>
            <div className="campaign-details-conatainer">
              <h3>Campign Data</h3>
              <div className="age-conatiner">
                <FormControl fullWidth>
                  <InputLabel id="cat-title-demo-label">CTA Title</InputLabel>
                  <Select
                    labelId="cat-title-demo-label"
                    id="cat-title-demo"
                    label="CTA Title"
                    value={ctaTitle}
                    onChange={(e) => handleOnChange(e, "ctaTitle")}
                    error={!!errors?.ctaTitle}
                    helperText={errors?.ctaTitle}
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

                <FormControl fullWidth>
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
                    onChange={(e) => handleOnChange(e, "budgetAmount")}
                    error={!!errors?.budgetAmount}
                    helperText={
                      errors?.budgetAmount || "Minimum budget should be ₹87"
                    }
                  />
                  <FormHelperText
                    sx={{ color: errors?.budgetAmount ? "red" : "gray" }}
                  >
                    {errors?.budgetAmount || "Minimum budget should be ₹87"}
                  </FormHelperText>
                </FormControl>
              </div>
            </div>

            <div className="target-audiance-container">
              <h3 className="title-target">Target Audience</h3>

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
                  onChange={(e) => handleOnChange(e, "minAge")}
                  error={!!errors?.minAge}
                  helperText={errors?.minAge || "Minimum age should be 18"}
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
                  onChange={(e) => handleOnChange(e, "maxAge")}
                  error={!!errors?.maxAge}
                  helperText={errors?.maxAge}
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
      <PostPublicSuccessModal
        showModal={showModal}
        paramaLink={successResponse?.permalink}
        adAccountLink={"https://adsmanager.facebook.com/adsmanager"}
        handleFinalSubmit={handleFinalSubmit}
      />
    </div>
  );
};

export default PublishPost;
