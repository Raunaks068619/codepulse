import React from 'react';
import { Container, Typography, Paper, Box, List, ListItem, ListItemText } from '@mui/material';

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center">
          Effective Date: {currentDate}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>1. Introduction</Typography>
          <Typography paragraph>
            Codepulse is committed to protecting the privacy of users interacting with Instagram Ads Generator. 
            This Privacy Policy explains how user data is collected, used, and safeguarded.
          </Typography>
          <Typography variant="h5" gutterBottom>2. Information We Collect</Typography>
          <Typography variant="h6" gutterBottom>a. Personal Information</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Name, email address, contact number, and payment information (if applicable)." />
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom>b. Usage Data</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="IP address, device information, browser type, session logs, and interaction metrics." />
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom>c. Cookies</Typography>
          <Typography paragraph>
            Instagram Ads Generator uses cookies to enhance user experience and analyze usage patterns.
          </Typography>
          <Typography variant="h5" gutterBottom>3. Purpose of Data Collection</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Deliver and support the core functionalities of Instagram Ads Generator." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Personalize services and improve platform performance." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Fulfill legal and regulatory obligations." />
            </ListItem>
          </List>
          <Typography variant="h5" gutterBottom>4. Sharing of Information</Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Authorized Partners" 
                secondary="Data may be shared with trusted partners for operations like payment processing or analytics under strict agreements."
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Legal Requirements" 
                secondary="Information may be disclosed to comply with legal obligations or enforce rights."
              />
            </ListItem>
          </List>
          <Typography variant="h5" gutterBottom>5. User Rights</Typography>
          <List dense>
            {['Access', 'Correction', 'Erasure', 'Portability'].map((right) => (
              <ListItem key={right}>
                <ListItemText
                  primary={right}
                  secondary={
                    right === 'Access' ? 'Users may request access to their personal information.' :
                    right === 'Correction' ? 'Users can update or rectify inaccurate data.' :
                    right === 'Erasure' ? 'Users may request the deletion of their personal information in compliance with legal obligations.' :
                    'Users can request a copy of their data in a structured, machine-readable format.'
                  }
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h5" gutterBottom>6. Data Retention</Typography>
          <Typography paragraph>
            Data will be retained only as long as necessary to fulfill the purposes outlined or as required by applicable laws.
          </Typography>
          <Typography variant="h5" gutterBottom>7. Contact</Typography>
          <Typography paragraph>
            For questions about this Privacy Policy, contact us at support@codepulse.com
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
