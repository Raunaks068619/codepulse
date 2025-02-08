import React from "react";
import { Box, TextField, styled, FormHelperText } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#e0e0e0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e0e0e0",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      // Add this for red border
      borderColor: theme.palette.error.main,
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "14px",
  },
  marginBottom: "0px",
}));

const CustomInput = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  helperText,
  ...props
}) => {
  return (
    <Box sx={{ mb: 1, minHeight: "80px" }}>
      <Box
        component="label"
        sx={{
          display: "block",
          mb: 0.5,
          fontWeight: 500,
          color: "#666",
          fontSize: "14px",
        }}
      >
        {label}
      </Box>
      <Box sx={{ position: "relative" }}>
        {Icon && (
          <Icon
            className="input-icon"
            sx={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b7280",
              zIndex: 1,
              fontSize: "20px",
            }}
          />
        )}
        <StyledTextField
          fullWidth
          placeholder={placeholder}
          type={type}
          variant="outlined"
          error={error}
          InputProps={{
            sx: {
              bgcolor: "white",
              height: "40px",
              paddingLeft: Icon ? "30px" : "14px",
            },
          }}
          {...props}
        />
      </Box>
      {error && helperText && (
        <FormHelperText error id="component-error-text">
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default CustomInput;
