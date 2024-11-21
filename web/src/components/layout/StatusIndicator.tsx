import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { CheckCircle, Error, HourglassEmpty } from "@mui/icons-material";

export interface StatusIndicatorProps {
  type: "joining" | "joined" | "leaving" | "left" | "error" | "full" | "idle";
  customMessage?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  customMessage,
}) => {
  const getStatusDetails = () => {
    switch (type) {
      case "joining":
        return {
          icon: <CircularProgress size={20} color="primary" />,
          message: "Joining game...",
        };
      case "joined":
        return {
          icon: <CheckCircle style={{ color: "#4caf50" }} />,
          message: "Successfully joined the game!",
        };
      case "leaving":
        return {
          icon: <CircularProgress size={20} color="secondary" />,
          message: "Leaving game...",
        };
      case "left":
        return {
          icon: <CheckCircle style={{ color: "#4caf50" }} />,
          message: "Successfully left the game.",
        };
      case "error":
        return {
          icon: <Error style={{ color: "#f44336" }} />,
          message: "An error occurred. Please try again.",
        };
      case "full":
        return {
          icon: <Error style={{ color: "#f44336" }} />,
          message: "This game is full. Please try another or create a new one.",
        };
      case "idle":
      default:
        return {
          icon: <HourglassEmpty style={{ color: "#2196f3" }} />,
          message: "Waiting for action...",
        };
    }
  };

  const { icon, message } = getStatusDetails();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={2}
      className="status-indicator"
      style={{
        background: "#f4f4f5",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        margin: "1rem auto",
        width: "100%",
        maxWidth: "400px",
      }}
    >
      <Box marginRight={2}>{icon}</Box>
      <Typography variant="body1">{customMessage || message}</Typography>
    </Box>
  );
};

export default StatusIndicator;
