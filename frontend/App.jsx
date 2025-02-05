import React from "react";
import Login from "./pages/Login";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#1877F2', // Facebook blue
    },
    secondary: {
      main: '#E4405F', // Instagram pink
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <div className="root">
        <Login />
      </div>
    </ThemeProvider>
  );
}

export default App;
