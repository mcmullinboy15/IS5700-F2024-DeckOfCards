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
import Navigation from "./Navigation";

export default function Header() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const auth = useContext(AuthContext);
  const user = auth?.user;
  const logout = auth?.logout;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  async function handleLogout() {
    try {
      if (!confirm("Are you sure you want to logout?")) {
        return;
      }

      if (logout) {
        await logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally add error handling UI here
    }
  }

  function handleProfile() {
    if (user?.uid) {
      navigate(`/profile/${user.uid}`);
    }
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
                {user.displayName || user.email}
              </Button>
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