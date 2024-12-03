import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  styled,
} from "@mui/material";
import { Menu, Person } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../firebase/auth";
import Navigation from "./Navigation";

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#000000",
  boxShadow: "none",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
});

const buttonStyles = {
  borderRadius: "8px",
  padding: "6px 16px",
  textTransform: "none",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
};

const authButtonStyles = {
  ...buttonStyles,
  border: "1px solid rgba(255, 255, 255, 0.3)",
  "&:hover": {
    border: "1px solid rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
};

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
      <StyledAppBar position="fixed">
        <Toolbar sx={{ minHeight: "70px" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Menu />
          </IconButton>

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "white",
              fontFamily: "cursive",
              fontSize: "1.5rem",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          >
            Deck of Cards Casino
          </Typography>

          {user ? (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                onClick={handleProfile}
                startIcon={<Person />}
                sx={buttonStyles}
              >
                {user.displayName}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outlined"
                sx={authButtonStyles}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box component={Link} to="/login" sx={{ textDecoration: "none" }}>
                <Button variant="outlined" sx={authButtonStyles}>
                  Login
                </Button>
              </Box>
              <Box
                component={Link}
                to="/register"
                sx={{ textDecoration: "none" }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    ...authButtonStyles,
                    backgroundColor: "rgba(139, 92, 246, 0.9)",
                    borderColor: "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(139, 92, 246, 1)",
                      borderColor: "transparent",
                    },
                  }}
                >
                  Register
                </Button>
              </Box>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
      <Toolbar />
      <Navigation open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
