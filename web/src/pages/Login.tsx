import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import GoogleSignIn from "../components/GoogleSignIn";
import { FormProvider, useForm } from "../context/FormProvider";

const LoginForm = () => {
  const navigate = useNavigate();
  const { state, setValue, errors, setErrors, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>();

  const onSubmit = async () => {
    setErrors({ email: "", password: "" });

    try {
      await signInWithEmailAndPassword(auth, state.email, state.password);
      navigate("/");
    } catch (error: any) {
      console.error("Error during sign in:", error);
      setErrors({
        email:
          error.code === "auth/invalid-email" ? "Invalid email address" : "",
        password:
          error.code === "auth/wrong-password" ? "Incorrect password" : "",
      });
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
      {(errors.email || errors.password) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.email && <div>{errors.email}</div>}
          {errors.password && <div>{errors.password}</div>}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={state.email || ""}
        onChange={(e) => setValue("email", e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={state.password || ""}
        onChange={(e) => setValue("password", e.target.value)}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign In
      </Button>
    </Box>
  );
};

const Login = () => (
  <FormProvider onSubmit={() => {}}>
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Sign In
          </Typography>

          <LoginForm />

          <Divider sx={{ my: 2 }}>or</Divider>

          <GoogleSignIn />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" variant="body2">
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  </FormProvider>
);

export default Login;
