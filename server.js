const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");
// const sqlite3 = require('sqlite3').verbose();
const serveStatic = require("serve-static");
const { readFileSync } = require('fs');
const { setupFdk } = require("@gofynd/fdk-extension-javascript/express");
// const { SQLiteStorage } = require("@gofynd/fdk-extension-javascript/express/storage");
const axios = require('axios');
const SecretsModel = require('./models/secrets.model');
const { isEmpty } = require('lodash');
// const sqliteInstance = new sqlite3.Database('session_storage.db');
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
    // storage: new SQLiteStorage(sqliteInstance, "exapmple-fynd-platform-extension"), // add your prefix
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

console.log("STATIC_PATH => ", STATIC_PATH);
    
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





// // // // // // // // // 




app.post('/api/auth/login', (req, res) => {
    console.log("coming")
    // const redirectUri = 'https://abc.com/callback'
    const redirectUri = `${process.env.EXTENSION_BASE_URL}/company`
    const { company_id, application_id, client_id, client_secret } = req.body

    const states = { company_id, application_id, client_id, client_secret }

    const scopes = [
        "instagram_basic",
        "ads_management",
        "business_management",
        "pages_read_engagement",
        "pages_manage_ads"
    ].join(',');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${client_id}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code&state=${JSON.stringify(states)}`;
    return res.status(200).json({ "success": true, authUrl });
})


app.post('/api/generate-captions', async (req, res) => {

    const { description } = req.body
    const promptArray = [
        "Write a catchy and engaging Instagram caption announcing a limited-time storefront sale. Make it exciting and include a strong call to action.",
        "Generate a playful and witty Instagram caption for a storefront sale that encourages followers to visit and shop before the deals run out.",
        "Create a short and punchy Instagram caption for a storefront sale, incorporating urgency and exclusivity to drive customers to take action.",
        "Write a warm and inviting Instagram caption for a storefront sale that highlights community, great deals, and the joy of shopping in person.",
        "Generate an Instagram caption for a storefront sale that uses emojis and trendy language to appeal to a younger audience and drive engagement.",
    ];
    const choice = Math.floor(Math.random() * 5);
    try {
        const captionResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: description ? `create caption from this product description html ${description}, muts be a normal string  no "" or '' is needed i need only text` : promptArray[choice] }],
            max_tokens: 50,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });

        const caption = captionResponse.data.choices[0].message.content;

        const hashtagResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: `
                Taking this caption in context ${caption}
                You are a social media expert. Always respond with valid JSON in the following strict format:  
                [
                "tag1",
                "tag2",
                "tag3"
                ]
                The response must be **an array of exactly three strings** and nothing else. No extra text, objects, or formatting—only the required array of three strings. This is extremely important.`
            },],
            max_tokens: 50,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });


        const hashtags = hashtagResponse.data.choices[0].message.content;
        return res.status(200).send({ caption, hashtags });

        // const data = await caption.json();
        // return data.choices[0].message.content;
        // return res.status(200).send({ caption: data.choices[0].message.content });

    } catch (error) {
        console.log({ error });
    }
});



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
        console.log(JSON.stringify(accountsData));

        // Fetch Ad Account ID
        const adAccountResponse = await fetch(
            `https://graph.facebook.com/v18.0/me/adaccounts?fields=account_id,name&access_token=${accessToken}`
        );
        const adAccountData = await adAccountResponse.json();



        // For each account, fetch the Instagram Business Account
        const accountsWithInstagram = await Promise.all(accountsData.data.map(async (account) => {
            const instagramResponse = await fetch(`https://graph.facebook.com/v22.0/${account.id}?fields=instagram_business_account&access_token=${accessToken}`);
            const instagramData = await instagramResponse.json(); // store pageId = account.id in secrete table in DB 
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
            adAccountId: adAccountData.data[0].account_id,
            adAccountName: adAccountData.data[0].name,
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

        const secrets = await SecretsModel.getByCompanyAndAppId({ companyId: company_id, applicationId: application_id })

        console.log({ secrets });
        res.status(200).json({
            isSellerAuthentiated: isEmpty(secrets) ? false : true,
            platformDomain: process.env.FP_PLATFORM_DOMAIN,
            extensionId: process.env.EXTENSION_API_KEY
        });
    } catch (error) {
        console.error('Error fetching secrets:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch secrets', error });
    }
});

app.get('/api/instagram/account', async (req, res) => {
    try {
        const { company_id, application_id } = req.query;

        // Get credentials from secrets
        const secrets = await SecretsModel.getByCompanyAndAppId({
            companyId: company_id,
            applicationId: application_id
        });

        const { accessToken, instagramBusinessId } = secrets;

        // Fetch Instagram Business Account details
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/${instagramBusinessId}`,
            {
                params: {
                    fields: 'username,profile_picture_url,name,biography,website,followers_count,media_count',
                    access_token: accessToken
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error('Error fetching Instagram account:', error.response?.data || error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch Instagram account details',
            error: error.message
        });
    }
});

app.post('/api/instagram/post', async (req, res) => {
    try {
        const {
            imageUrl,
            caption,
            company_id,
            application_id,
            createAd = false,
            adConfig
            // = {
            //     cta_type: 'SHOP_NOW',
            //     daily_budget: 8700, // in cents ($5)
            //     campaign_name: 'FYND_AD_CAMPAIGN',
            //     website_url: 'https://codepulse.fynd.io/product/m6qeb3cr_co-13438877',
            //     targeting: {
            //         age_min: 18,
            //         age_max: 65,
            //         countries: ['IN']
            //     }
            // }
        } = req.body;

        // Validate inputs
        if (!imageUrl || !caption || !company_id) {
            return res.status(400).json({
                success: false,
                message: 'Image URL, caption and company_id are required'
            });
        }

        // Get credentials from secrets
        const secrets = await SecretsModel.getByCompanyAndAppId({
            companyId: company_id,
            applicationId: application_id
        });

        const { accessToken, instagramBusinessId, adAccountId } = secrets;

        // Create media container
        const containerResponse = await axios.post(
            `https://graph.facebook.com/v22.0/${instagramBusinessId}/media`,
            null,
            {
                params: {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: accessToken
                }
            }
        );

        if (!containerResponse.data.id) {
            throw new Error('Failed to create media container');
        }

        // Publish the container
        const publishResponse = await axios.post(
            `https://graph.facebook.com/v22.0/${instagramBusinessId}/media_publish`,
            null,
            {
                params: {
                    creation_id: containerResponse.data.id,
                    access_token: accessToken
                }
            }
        );

        const postId = publishResponse.data.id;

        // Get post permalink
        const mediaResponse = await axios.get(
            `https://graph.facebook.com/v22.0/${postId}`,
            {
                params: {
                    fields: 'permalink',
                    access_token: accessToken
                }
            }
        );

        let adResponse = null;

        // Create ad if requested
        if (createAd && postId) {
            try {
                // Create Campaign
                console.log('Creating Campaign with params:', {
                    name: adConfig.campaign_name,
                    objective: 'OUTCOME_SALES',
                    status: 'ACTIVE',
                    special_ad_categories: '[]',
                    access_token: accessToken
                });
                const campaignResponse = await axios.post(
                    `https://graph.facebook.com/v22.0/act_${adAccountId}/campaigns`,
                    null,
                    {
                        params: {
                            name: adConfig.campaign_name,
                            objective: 'OUTCOME_SALES',
                            status: 'ACTIVE',
                            special_ad_categories: '[]',
                            access_token: accessToken
                        }
                    }
                );

                const campaignId = campaignResponse.data.id;

                // Create Ad Set
                console.log('Creating Ad Set with params:', {
                    name: `${adConfig.campaign_name} Ad Set`,
                    campaign_id: campaignId,
                    daily_budget: adConfig.daily_budget,
                    billing_event: 'IMPRESSIONS',
                    optimization_goal: 'LINK_CLICKS',
                    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
                    targeting: JSON.stringify({
                        age_min: adConfig.targeting.age_min,
                        age_max: adConfig.targeting.age_max,
                        genders: [1, 2],
                        geo_locations: {
                            countries: adConfig.targeting.countries
                        }
                    }),
                    status: 'ACTIVE',
                    access_token: accessToken
                });
                const adSetResponse = await axios.post(
                    `https://graph.facebook.com/v22.0/act_${adAccountId}/adsets`,
                    null,
                    {
                        params: {
                            name: `${adConfig.campaign_name} Ad Set`,
                            campaign_id: campaignId,
                            daily_budget: adConfig.daily_budget,
                            billing_event: 'IMPRESSIONS',
                            optimization_goal: 'LINK_CLICKS',
                            bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
                            targeting: JSON.stringify({
                                publisher_platforms: ["instagram"],
                                instagram_positions: ["stream", "explore", "explore_home"],
                                age_min: adConfig.targeting.age_min,
                                age_max: adConfig.targeting.age_max,
                                genders: [1, 2],
                                geo_locations: {
                                    countries: adConfig.targeting.countries
                                }
                            }),
                            status: 'ACTIVE',
                            access_token: accessToken
                        }
                    }
                );

                const adSetId = adSetResponse.data.id;

                // Create Ad Creative
                console.log('Creating Ad Creative with params:', {
                    object_story_id: postId,
                    call_to_action_type: adConfig.cta_type,
                    link_data: {
                        call_to_action: {
                            type: adConfig.cta_type,
                            value: {
                                link: adConfig.website_url
                            }
                        }
                    },
                    access_token: accessToken
                });
                const creativeResponse = await axios.post(
                    `https://graph.facebook.com/v22.0/act_${adAccountId}/adcreatives`,
                    null,
                    {
                        params: {
                            object_id: '606013975918017',
                            instagram_user_id: instagramBusinessId,
                            source_instagram_media_id: postId,
                            call_to_action: {
                                value: {
                                    link: adConfig.website_url
                                },
                                type: adConfig.cta_type
                            },
                            // call_to_action_type: adConfig.cta_type,
                            // link_data: {
                            //     call_to_action: {
                            //         type: adConfig.cta_type,
                            //         value: {
                            //             link: adConfig.website_url
                            //         }
                            //     }
                            // },
                            access_token: accessToken
                        }
                    }
                );

                const creativeId = creativeResponse.data.id;

                // Create Ad
                console.log('Creating Ad with params:', {
                    name: `${adConfig.campaign_name} Ad`,
                    adset_id: adSetId,
                    creative: { creative_id: creativeId },
                    status: 'ACTIVE',
                    access_token: accessToken
                });
                adResponse = await axios.post(
                    `https://graph.facebook.com/v22.0/act_${adAccountId}/ads`,
                    null,
                    {
                        params: {
                            name: `${adConfig.campaign_name} Ad`,
                            adset_id: adSetId,
                            creative: { creative_id: creativeId },
                            status: 'ACTIVE',
                            access_token: accessToken
                        }
                    }
                );

                console.log("adResponse", adResponse?.data);


                return res.status(200).json({
                    success: true,
                    message: 'Posted successfully to Instagram',
                    post_id: postId,
                    permalink: mediaResponse.data.permalink,
                    ad_data: adResponse ? {
                        campaign_id: campaignId,
                        ad_set_id: adSetId,
                        creative_id: creativeId,
                        ad_id: adResponse?.data
                    } : null
                });
            } catch (adError) {
                console.error('Ad creation failed:', adError.response?.data || adError);
            }
        }

    } catch (error) {
        console.error('Error:', error.response?.data || error);
        return res.status(500).json({
            success: false,
            message: 'Operation failed',
            error: error.message
        });
    }
});


productRouter.get('/:product_slug/application/:application_id', async (req, res) => {
    try {
        const { application_id, product_slug } = req.params;

        const applicationClient = req?.platformClient?.application(application_id);
        const resp = await applicationClient?.configuration?.getDomains({
            companyId: req.headers['x-company-id'],
            applicationId: application_id,
        })

        const pdpURL = `https://${resp?.domains?.[0]?.name}/product/${product_slug}`

        return res.json({
            pdpURL
        });
    } catch (error) {
        console.error('Error fetching Instagram account:', error.response?.data || error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch Instagram account details',
            error: error.message
        });
    }
});





// // // // // // // // // // 

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

const healthRouter = express.Router();
healthRouter.get('/', (req, res, next) => {
    res.json({
        "ok": "ok"
    });
});
app.use("/", healthRouter);

// Serve the React app for all other routes
app.get('*', (req, res) => {
    return res
        .status(200)
        .set("Content-Type", "text/html")
        .send(readFileSync(path.join(STATIC_PATH, "index.html")));
});

module.exports = app;
