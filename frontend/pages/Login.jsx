import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style/home.css";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";

const Login = () => {
    const [fbAccessToken, setFbAccessToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [instagramAccounts, setInstagramAccounts] = useState([]);

    const [searchParams] = useSearchParams()
    const paramValue = searchParams.get("state");
    const code = searchParams.get("code");

    // Replace with your Facebook App ID
    const FB_APP_ID = '657917179960900';
    const FB_APP_SECRETE = '208f341f4575f366d74a1d76002ddac4';


    const handlelogin = async () => {
        setLoading(true)
        const res = await axios.post('/api/auth/login', { FB_APP_ID, FB_APP_SECRETE })
        window.open(res.data.authUrl)
    }

    const fetchInstagramAccounts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/business/instagram/account?access_token=${fbAccessToken}`);
            setInstagramAccounts(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Instagram accounts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {

        console.log({ paramValue: JSON.parse(paramValue), code });
        setFbAccessToken(code)
        setLoading(false)

    }, [paramValue, code]);

    //   const postToInstagram = async (imageUrl, caption) => {
    //     if (!fbAccessToken) {
    //       console.error('No access token available');
    //       return;
    //     }

    //     try {
    //       // 1. First get the Facebook Page ID
    //       const pagesResponse = await axios.get(
    //         `https://graph.facebook.com/v18.0/me/accounts?access_token=${fbAccessToken}`
    //       );
    //       const pageId = pagesResponse.data.data[0].id;

    //       // 2. Get the Instagram Business Account ID
    //       const instagramResponse = await axios.get(
    //         `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${fbAccessToken}`
    //       );
    //       const igBusinessId = instagramResponse.data.instagram_business_account.id;

    //       // 3. Create a container for the image
    //       const mediaResponse = await axios.post(
    //         `https://graph.facebook.com/v18.0/${igBusinessId}/media`,
    //         {
    //           image_url: imageUrl,
    //           caption: caption,
    //           access_token: fbAccessToken
    //         }
    //       );
    //       const creationId = mediaResponse.data.id;

    //       // 4. Publish the container
    //       const publishResponse = await axios.post(
    //         `https://graph.facebook.com/v18.0/${igBusinessId}/media_publish`,
    //         {
    //           creation_id: creationId,
    //           access_token: fbAccessToken
    //         }
    //       );

    //       console.log('Successfully posted to Instagram:', publishResponse.data);
    //     } catch (error) {
    //       console.error('Error posting to Instagram:', error.response?.data || error);
    //     }
    //   };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Instagram Business Integration</h2>

            <div style={{ marginTop: '20px' }}>
                {loading ? (
                    <div data-testid="loader" style={{ textAlign: 'center' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <div>
                        {!fbAccessToken ? (
                            <Button variant="contained" color="primary" onClick={handlelogin}>
                                Login with Facebook
                            </Button>
                        ) : (
                            <div>
                                <p>Connected to Facebook!</p>
                                <Button variant="contained" color="secondary" onClick={fetchInstagramAccounts}>
                                    Refresh Accounts
                                </Button>

                                {instagramAccounts.length > 0 && (
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '15px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}>
                                        <h3>Your Instagram Business Accounts:</h3>
                                        {instagramAccounts.map((account) => (
                                            <div key={account.id} style={{
                                                marginBottom: '15px',
                                                padding: '10px',
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: '4px'
                                            }}>
                                                <p>Page Name: {account.name}</p>
                                                {account.instagram_business_account && (
                                                    <p>Instagram Business ID: {account.instagram_business_account.id}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;