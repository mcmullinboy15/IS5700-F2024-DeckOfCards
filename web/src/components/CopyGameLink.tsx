import { IconButton, Tooltip, Snackbar } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";
import { useState } from "react";

interface CopyGameLinkProps {
  gameId: string;
  isActive: boolean;
}

const CopyGameLink = ({ isActive }: CopyGameLinkProps) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setShowSnackbar(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isActive) {
    return null;
  }

  return (
    <>
      <Tooltip title="Copy game link">
        <IconButton onClick={handleCopy} color={copied ? "success" : "default"}>
          {copied ? <DoneIcon /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        message="Game link copied to clipboard!"
      />
    </>
  );
};

export default CopyGameLink;
