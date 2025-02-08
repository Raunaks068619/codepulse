import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ children, ...props }) => {
  return (
    <Button
      style={{
        textTransform: "capitalize",
        fontWeight: 'bold'
      }}
      fullWidth
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
