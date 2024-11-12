import { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

export default function Header() {

  const [profile, setProfile] = useState<string | null>(null);  // TODO: set profile state to something from Auth Provider (not just a string)

  function handleLogin() {  // TODO: direct to login page
    setProfile("Bob");
  }

  function handleLogout() {  // TODO: USER LOGOUT with Auth Provider
    setProfile(null);
  }

  function handleProfile() { // TODO: direct to profile page
    console.log("Profile");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Deck of Cards Project
          </Typography>
          {profile ? (
            <>
            <Button onClick={handleProfile} color="inherit">{profile}</Button>  {/* TODO: Get username from Auth provider */}
            <Button onClick={handleLogout} color="inherit">Logout</Button>
            </>
            ) : (
            <Button onClick={handleLogin} color="inherit">Login</Button> )  
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}
