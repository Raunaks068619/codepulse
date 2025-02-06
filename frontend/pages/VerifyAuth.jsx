import React, { useEffect } from "react";
import axios from "axios";
import {
  useParams,
  useSearchParams,
} from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { toast } from "sonner";

const VerifyAuth = () => {
  const { company_id, application_id } = useParams();

  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("state");
  const parsedParams = JSON.parse(paramValue);
  const code = searchParams.get("code");

  useEffect(() => {
    console.log(company_id, application_id, { parsedParams });

    if (code) {
      getAccessToken();
    }
  }, [code]);

  const getAccessToken = async () => {
    try {
      if (code) {
        const res = await axios.get(`/api/instagram/auth`, {
          params: { code, ...parsedParams },
        });
        console.log("getAccessToken :: res", res);

        if (res?.status === 200) {
          window.location.href = res?.data?.redirectUrl;
        } else {
          fetchAndRedirectToPlatform();
        }
      }
    } catch (error) {
      await fetchAndRedirectToPlatform();
      console.log("getAccessToken :: error", error);
    }
  };

  const fetchAndRedirectToPlatform = async () => {
    try {
      const res = await axios.get(`/api/secrets`, {
        params: { company_id, application_id },
      });
      console.log("fetchAndRedirectToPlatform :: ", { res });

      if (res.status === 200) {
        console.log({ res });
        const prepareUrl = `${res?.data?.platformDomain}/company/${company_id}/application/${application_id}/extensions/${res?.data?.extensionId}`;
        window.location.href = prepareUrl;
      }
    } catch (err) {
      window.location.href = `https://platform.fynd.com/company/${company_id}/application/${application_id}`;
      toast("Error While storing Access Token");
    }
  };

  return (
    <div className="verify-auth-container">
      <div className="loader-container">
        <CircularProgress />
      </div>
    </div>
  );
};

export default VerifyAuth;
