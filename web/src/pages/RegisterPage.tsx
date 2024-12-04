import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Link,
} from "@mui/material";
import { register } from "../firebase/auth";
import { showToast } from "../components/CustomToast";
import { validatePassword } from "firebase/auth";
import { auth } from "../firebase/config";

type AccessLevel = "Player" | "Admin";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");
  const [shake, setShake] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [access, setAccess] = useState<AccessLevel>("Player");

  // Email regex for validation
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setShake("shake");
      return;
    }

    const passwordStatus = await validatePassword(auth, password);
    if (!passwordStatus.isValid) {
      setError("Password does not meet criteria.");
      setShake("shake");
      return;
    }

    const result = regex.test(email);
    if (!result) {
      setError("Invalid email address.");
      setShake("shake");
      return;
    }

    // Proceed with registration
    register(email, password, username, access)
      .then(() => {
        showToast("User registered successfully.", "success");
        setError("");
        setShake("");
        navigate("/login");
      })
      .catch((error: { message: string }) => {
        const errorMessage = error.message || "Registration failed.";
        setError(errorMessage);
        setShake("shake");
      });
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  const handleAccessChange = (event: ChangeEvent<{ value: unknown }>) => {
    setAccess(event.target.value as AccessLevel);
  };

  return (
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
            Create an Account
          </Typography>

          {error && (
            <span className={`text-red-500 mx-auto ${shake} block`}>
              {error}
            </span>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange(setEmail)}
              value={email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              onChange={handleChange(setUsername)}
              value={username}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              name="password"
              autoComplete="new-password"
              onChange={handleChange(setPassword)}
              value={password}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              onChange={handleChange(setConfirmPassword)}
              value={confirmPassword}
            />
            <TextField
              select
              fullWidth
              label="Select Access"
              name="access"
              value={access}
              onChange={handleAccessChange}
              sx={{ mt: 2 }}
            >
              <MenuItem value="Player">Player</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/login" variant="body2">
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
