import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./style/home.css";
import { redirect, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";

const Login = () => {
    const [fbAccessToken, setFbAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [instagramAccounts, setInstagramAccounts] = useState([]);
    const navigator = useNavigate();

    const { company_id, application_id } = useParams();

    const [searchParams] = useSearchParams()
    const paramValue = searchParams.get("state");
    const parsedParams = JSON.parse(paramValue)
    const code = searchParams.get("code");


    const getAccessToken = async () => {
        console.log("accessToken clicked");

        if (code) {
            console.log({ code });

            const res = await axios.get(`/api/instagram/auth`, { params: { code, ...parsedParams } })
            console.log("/api/accesstoken", res);

            if (res.status === 200) {
                window.location.href = res.data.redirectUrl;
            }
        }
    }
    const handlelogin = async () => {
        const res = await axios.post('/api/auth/login', {
            company_id,
            application_id,
            client_id: '657917179960900', // will get this from input
            client_secret: '208f341f4575f366d74a1d76002ddac4', // will get this from input
        })
        window.parent.location.href = res.data.authUrl;
    }

    const checkAuth = async () => {
        console.log("checkAuth clicked", { company_id, application_id });

        const res = await axios.get(`/api/secrets`, { params: { company_id, application_id } })
        console.log({ res });

        if (res.status === 200) {
            console.log({ res });
        }
        // else {
        //     handlelogin()
        // }
    }



    // useEffect(() => {
    //     checkAuth()
    // }, [])

    useEffect(() => {
        console.log(company_id, application_id, { parsedParams });

        if (code) {
            getAccessToken();
        }

    }, [code]);


    return (
        <div style={{ padding: '20px' }}>
            <h2>Instagram Business Integration</h2>
            <Button onClick={checkAuth}> GET secrets</Button>
            <Button onClick={handlelogin}> Login</Button>
        </div>
    );
};

export default Login;