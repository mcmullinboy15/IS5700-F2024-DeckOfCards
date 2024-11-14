import { Button } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
   const navigate = useNavigate();
   const auth = getAuth();

   const handleGoogleSignIn = async () => {
      try {
         const provider = new GoogleAuthProvider();
         await signInWithPopup(auth, provider);
         navigate("/");
      } catch (error) {
         console.error("Error signing in with Google:", error);
      }
   };

   return (
      <Button
         variant="outlined"
         fullWidth
         startIcon={<GoogleIcon />}
         onClick={handleGoogleSignIn}
         sx={{
            mt: 2,
            mb: 2,
            textTransform: "none",
            borderColor: "#4285f4",
            color: "#4285f4",
         }}
      >
         Sign in with Google
      </Button>
   );
};

export default GoogleSignIn;
