const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const serveStatic = require("serve-static");
const { readFileSync } = require('fs');
const { setupFdk } = require("@gofynd/fdk-extension-javascript/express");
const { SQLiteStorage } = require("@gofynd/fdk-extension-javascript/express/storage");
const axios = require('axios');
const SecretsModel = require('./models/secrets.model');
const sqliteInstance = new sqlite3.Database('session_storage.db');
const productRouter = express.Router();

console.log("first", process.env.EXTENSION_BASE_URL)

const fdkExtension = setupFdk({
    api_key: process.env.EXTENSION_API_KEY,
    api_secret: process.env.EXTENSION_API_SECRET,
    base_url: process.env.EXTENSION_BASE_URL,
    cluster: process.env.FP_API_DOMAIN,
    callbacks: {
        auth: async (req) => {
            // Write you code here to return initial launch url after auth process complete
            if (req.query.application_id)
                return `${req.extension.base_url}/company/${req.query['company_id']}/application/${req.query.application_id}`;
            else
                return `${req.extension.base_url}/company/${req.query['company_id']}`;
        },

        uninstall: async (req) => {
            // Write your code here to cleanup data related to extension
            // If task is time taking then process it async on other process.
        }
    },
    storage: new SQLiteStorage(sqliteInstance, "exapmple-fynd-platform-extension"), // add your prefix
    access_mode: "online",
    webhook_config: {
        api_path: "/api/webhook-events",
        notification_email: "pritigediya@fynd-extenal.com",
        event_map: {
            "company/product/delete": {
                "handler": (eventName) => { console.log(eventName) },
                "version": '1'
            }
        }
    },
});

const STATIC_PATH = process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'frontend', 'public', 'dist')
    : path.join(process.cwd(), 'frontend');

const app = express();
const platformApiRoutes = fdkExtension.platformApiRoutes;

// Middleware to parse cookies with a secret key
app.use(cookieParser("ext.session"));

// Middleware to parse JSON bodies with a size limit of 2mb
app.use(bodyParser.json({
    limit: '2mb'
}));

// Serve static files from the React dist directory
app.use(serveStatic(STATIC_PATH, { index: false }));

// FDK extension handler and API routes (extension launch routes)
app.use("/", fdkExtension.fdkHandler);

// Route to handle webhook events and process it.
app.post('/api/webhook-events', async function (req, res) {
    try {
        console.log(`Webhook Event: ${req.body.event} received`)
        await fdkExtension.webhookRegistry.processWebhook(req);
        return res.status(200).json({ "success": true });
    } catch (err) {
        console.log(`Error Processing ${req.body.event} Webhook`);
        return res.status(500).json({ "success": false });
    }
})

app.post('/api/auth/login', (req, res) => {
    console.log("coming")
    // const redirectUri = 'https://abc.com/callback'
    const redirectUri = `${process.env.EXTENSION_BASE_URL}/company`
    const { company_id, application_id, client_id, client_secret } = req.body

    const states = { company_id, application_id, client_id, client_secret }

    const scopes = ["instagram_basic"].join(',');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${client_id}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&state=${JSON.stringify(states)}`;
    return res.status(200).json({ "success": true, authUrl });
})

app.get('/api/instagram/auth', async (req, res) => {
    try {
        console.log({ query: req.query });

        const { code,
            company_id: companyId,
            application_id: applicationId,
            client_id: clientId,
            client_secret: clientSecret } = req.query;

        // Get access token
        const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: clientId,
                redirect_uri: `${process.env.EXTENSION_BASE_URL}/company`,
                client_secret: clientSecret,
                code: code
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Increase TTL of token
        await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                grant_type: 'fb_exchange_token',
                client_id: clientId,
                client_secret: clientSecret,
                fb_exchange_token: accessToken
            }
        });

        // Get Instagram accounts using the access token
        const accountsResponse = await fetch(`https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`);
        const accountsData = await accountsResponse.json();

        // For each account, fetch the Instagram Business Account
        const accountsWithInstagram = await Promise.all(accountsData.data.map(async (account) => {
            const instagramResponse = await fetch(`https://graph.facebook.com/v22.0/${account.id}?fields=instagram_business_account&access_token=${accessToken}`);
            const instagramData = await instagramResponse.json();
            return {
                ...account,
                instagram_business_account: instagramData.instagram_business_account || null
            };
        }));

        // Store in DB
        const instagramAccountData = accountsWithInstagram[0];


        const newSecret = await SecretsModel.create({
            companyId,
            applicationId,
            instagramBusinessId: instagramAccountData.instagram_business_account.id,
            accessToken,
            clientId,
            clientSecret
        });
        console.log({ newSecret });

        if (newSecret.error) {
            if (newSecret.message.includes('already exists')) {
                return res.status(409).json({ error: newSecret.message });
            }
        }

        return res.status(200).json({
            ...instagramAccountData,
            companyId,
            applicationId,
            redirectUrl: `${process.env.FP_PLATFORM_DOMAIN}/company/${companyId}/application/${applicationId}/extensions/${process.env.EXTENSION_API_KEY}`
        });
    } catch (error) {
        console.error('Error:', error.response?.data || error);
        res.status(500).json({ message: 'Failed to process request', error });
    }
});

app.get('/api/secrets', async (req, res) => {
    try {
        const { company_id, application_id } = req.query;
        console.log('/api/secrets', { company_id, application_id });

        const secrets = await SecretsModel.getByCompanyId({ companyId: company_id, applicationId: application_id })

        console.log({ secrets });
        res.status(200).json({ success: true, secrets });
    } catch (error) {
        console.error('Error fetching secrets:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch secrets', error });
    }
});
// app.post('/api/secrets', async (req, res) => {
//     try {
//         const { key, value } = req.body;
//         await SecretsController.addNewSecret(key, value);
//         res.status(200).json({ success: true, message: 'Secret added successfully' });
//     } catch (error) {
//         console.error('Error adding secret:', error);
//         res.status(500).json({ success: false, message: 'Failed to add secret', error });
//     }
// });

// app.get('/api/accesstoken', async (req, res) => {
//     console.log("Handling OAuth Callback");
//     const { code } = req.query;
//     console.log(req.query);

//     try {
//         const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
//             params: {
//                 client_id: process.env.CLIENT_ID,
//                 redirect_uri: `${process.env.EXTENSION_BASE_URL}/company`, // Removed extra bracket
//                 client_secret: process.env.CLIENT_SECRET,
//                 code: code
//             }
//         });

//         if (response.data && response.data.access_token) {
//             const accessToken = response.data.access_token;
//             // Use the access token as needed
//             console.log('Access Token:', accessToken);
//             res.status(200).json({ success: true, access_token: accessToken });
//         } else {
//             console.error('No access token found in response:', response.data);
//             res.status(500).json({ success: false, message: 'No access token received' });
//         }
//     } catch (error) {
//         console.error('Error fetching access token:', error.message);
//         res.status(400).json({ error: error.message });
//     }
// });
// app.post('/api/refresh-token', async (req, res) => {
//     const { refresh_token } = req.body;

//     if (!refresh_token) {
//         return res.status(400).json({ error: 'Refresh token is required' });
//     }

//     try {
//         const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
//             params: {
//                 grant_type: 'fb_exchange_token',
//                 client_id: process.env.CLIENT_ID,
//                 client_secret: process.env.CLIENT_SECRET,
//                 fb_exchange_token: refresh_token
//             }
//         });

//         if (response.data && response.data.access_token) {
//             const newAccessToken = response.data.access_token;
//             console.log('New Access Token:', newAccessToken);
//             res.status(200).json({ success: true, access_token: newAccessToken });
//         } else {
//             console.error('No access token found in response:', response.data);
//             res.status(500).json({ success: false, message: 'No access token received' });
//         }
//     } catch (error) {
//         console.error('Error refreshing access token:', error.message);
//         res.status(400).json({ error: error.message });
//     }
// });

// app.get('/api/business/instagram/account', async (req, res) => {
//     try {
//         const accessToken = req.query.access_token || process.env.FB_ACCESS_TOKEN;
//         if (!accessToken) {
//             return res.status(400).json({ error: 'Access token is required' });
//         }

//         // Fetch the list of accounts
//         const accountsResponse = await fetch(`https://graph.facebook.com/v22.0/me/accounts?access_token=${accessToken}`);
//         const accountsData = await accountsResponse.json();

//         if (!accountsResponse.ok) {
//             return res.status(accountsResponse.status).json(accountsData);
//         }

//         // For each account, fetch the Instagram Business Account
//         const accountsWithInstagram = await Promise.all(accountsData.data.map(async (account) => {
//             const instagramResponse = await fetch(`https://graph.facebook.com/v22.0/${account.id}?fields=instagram_business_account&access_token=${accessToken}`);
//             const instagramData = await instagramResponse.json();
//             return {
//                 ...account,
//                 instagram_business_account: instagramData.instagram_business_account || null
//             };
//         }));

//         return res.status(200).json({ data: accountsWithInstagram });
//     } catch (error) {
//         console.error('Error fetching accounts:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// });

productRouter.get('/', async function view(req, res, next) {
    try {
        const {
            platformClient
        } = req;
        const data = await platformClient.catalog.getProducts()
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Get products list for application
productRouter.get('/application/:application_id', async function view(req, res, next) {
    try {
        const {
            platformClient
        } = req;
        const { application_id } = req.params;
        const data = await platformClient.application(application_id).catalog.getAppProducts()
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// FDK extension api route which has auth middleware and FDK client instance attached to it.
platformApiRoutes.use('/products', productRouter);

// If you are adding routes outside of the /api path, 
// remember to also add a proxy rule for them in /frontend/vite.config.js
app.use('/api', platformApiRoutes);

// Serve the React app for all other routes
app.get('*', (req, res) => {
    return res
        .status(200)
        .set("Content-Type", "text/html")
        .send(readFileSync(path.join(STATIC_PATH, "index.html")));
});

module.exports = app;
