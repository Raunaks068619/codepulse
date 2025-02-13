import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';

const DataGovernance = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Data Governance and Handling Policy
                </Typography>
                <Typography variant="subtitle1" gutterBottom align="center">
                    Effective Date: [Insert Date]
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        1. Purpose and Scope
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This policy governs how Codepulse collects, processes, stores, and disposes of data associated with Instagram Ads generator. It applies to all interactions and operations involving the extension and is designed to ensure compliance with global standards such as GDPR, CCPA, and applicable local laws.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        2. Principles of Data Governance
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Accountability: Codepulse takes full responsibility for data stewardship and security." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Transparency: Users are informed about how their data is handled and protected." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Data Quality: Ensure accuracy, consistency, and reliability of all collected data." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Compliance: Adhere to all legal, regulatory, and contractual obligations." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Security: Implement robust measures to protect against unauthorized access and misuse." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>
                        3. Data Handling Lifecycle
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        a. Data Collection
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Collect only data essential for Instagram Ads generator's operation." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Obtain explicit user consent wherever necessary." />
                        </ListItem>
                    </List>
                    <Typography variant="subtitle1" gutterBottom>
                        b. Data Storage
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Use encrypted databases for storing data." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Enforce role-based access controls (RBAC) to restrict unauthorized access." />
                        </ListItem>
                    </List>
                    <Typography variant="subtitle1" gutterBottom>
                        c. Data Usage
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Use data strictly for purposes outlined in the privacy policy of Instagram Ads generator." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Regularly monitor access logs to prevent misuse." />
                        </ListItem>
                    </List>
                    <Typography variant="subtitle1" gutterBottom>
                        d. Data Sharing
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Share data only with authorized entities under strict data processing agreements." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Codepulse ensures third-party compliance with equivalent security standards." />
                        </ListItem>
                    </List>
                    <Typography variant="subtitle1" gutterBottom>
                        e. Retention and Disposal
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Retain user data only for as long as necessary to fulfill operational purposes or comply with legal obligations." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Securely dispose of obsolete data using approved methods such as secure deletion for digital records or shredding for physical records." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>
                        4. Security Measures
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Encryption for data at rest and in transit." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Regular vulnerability and penetration testing to ensure system integrity." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Multi-factor authentication (MFA) to safeguard sensitive systems." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>
                        5. Governance and Compliance
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Appoint a Data Protection Officer to oversee compliance." />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Conduct annual audits to ensure alignment with regulatory standards." />
                        </ListItem>
                    </List>
                    <Typography variant="h5" gutterBottom>
                        6. Review Cycle
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This policy will be reviewed semi-annually or following significant regulatory changes.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Contact Information
                    </Typography>
                    <Typography variant="body1" paragraph>
                        For queries related to this policy, email us at raunaksingh@gofynd.com.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default DataGovernance;
