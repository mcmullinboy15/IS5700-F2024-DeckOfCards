import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoadingSpinnerProps {
  size?: number;
  color?: "primary" | "secondary" | "inherit";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "primary",
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <CircularProgress size={size} color={color} />
    </Box>
  );
};
