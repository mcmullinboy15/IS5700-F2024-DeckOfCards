import { useState } from "react";
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
import { User } from "firebase/auth";
import Navigation from "./Navigation";

export default function Header() {
  // const user = useContext(AuthContext);  // this will be the real call

  const user: Partial<User> = {
    // dummy data
    uid: "1",
    email: "bob@gmail.com",
    displayName: "Bobby McGee",
  };

  const navigator = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [profile, setProfile] = useState<User | null>(null); // TODO: set profile state to something from Auth Provider (not just a string)

  // useEffect(() => {
  //   if (user && !profile) {
  //     setProfile(user);
  //   }
  // }, [user]);

  function handleLogout() {
    // TODO: redirect to login and clear user from Auth provider
    setProfile(null);
  }

  function handleProfile() {
    // TODO: direct to profile page

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

          <Button onClick={() => navigator("/")} color="inherit">
            Home
          </Button>
          {profile ? (
            <>
              <Button onClick={handleProfile} color="inherit">
                {profile.displayName}
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
