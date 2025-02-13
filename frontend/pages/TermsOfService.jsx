import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';

const TermsOfService = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Terms of Service
                </Typography>
                <Typography variant="subtitle1" gutterBottom align="center">
                    Effective Date: [Insert Date]
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Agreement to Terms
                    </Typography>
                    <Typography variant="body1" paragraph>
                        By using Instagram Ads generator, users agree to be bound by these Terms of Use. Codepulse reserves the right to amend these terms at any time.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Eligibility
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Users must be of legal age and have the authority to agree to these terms on behalf of their entity, if applicable.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        User Responsibilities
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Provide accurate and up-to-date information during registration and usage." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Maintain the confidentiality of access credentials." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Use Instagram Ads generator solely for lawful purposes." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>
                        Prohibited Activities
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Use Instagram Ads generator for fraudulent activities or violating any laws." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Reverse engineer or attempt to gain unauthorized access to Instagram Ads generator." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>
                        Intellectual Property
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Codepulse retains all rights, titles, and interests in Instagram Ads generator, including trademarks, copyrights, and proprietary code. Users are granted a limited, non-transferable, non-exclusive license to use Instagram Ads generator in compliance with these terms.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Disclaimer of Warranties
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Instagram Ads generator is provided "as is" and "as available." Codepulse disclaims all implied warranties to the extent permitted by law.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Limitation of Liability
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Codepulse will not be liable for any indirect, incidental, or consequential damages arising from the use of Instagram Ads generator.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Governing Law
                    </Typography>
                    <Typography variant="body1" paragraph>
                        These terms are governed by the laws of [JURISDICTION]. Disputes shall be resolved exclusively in the courts of [JURISDICTION].
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Termination
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Codepulse reserves the right to suspend or terminate access to Instagram Ads generator for any breach of these terms.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Contact Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        For queries related to these Terms of Use, email us at raunaksingh@gofynd.com.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default TermsOfService;
