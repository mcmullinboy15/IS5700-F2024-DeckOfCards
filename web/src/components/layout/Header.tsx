import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Menu } from "@mui/icons-material";

import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../firebase/auth";

import Navigation from "./Navigation";

export default function Header() {
  const navigator = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user } = useContext(AuthContext) || {};

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  async function handleLogout() {
    if (!confirm("Are you sure you want to logout?")) {
      return;
    }

    await logout();
    navigator("/login");
  }

  function handleProfile() {
    navigator(`/profile/${user?.uid}`);
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
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Deck of Cards Project
          </Typography>

          {user ? (
            <>
              <Button onClick={handleProfile} color="inherit">
                {user.displayName}
              </Button>
              {/* TODO: Get username from Auth provider */}
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>

              <Link to="/register">
                <Button color="inherit">Register</Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Navigation open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
