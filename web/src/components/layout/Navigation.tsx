import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import { Home, Casino, Person, Dashboard } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";

interface NavigationProps {
  open: boolean;
  onClose: () => void;
}

const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": {
    width: 250,
    backgroundColor: "#111928",
    color: "white",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  },
});

const StyledListItemButton = styled(ListItemButton)({
  "&:hover": {
    backgroundColor: "rgba(139, 92, 246, 0.1)",
  },
  "&.active": {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  margin: "4px 8px",
  borderRadius: "8px",
  transition: "all 0.2s ease",
});

const StyledListItemIcon = styled(ListItemIcon)({
  color: "rgba(255, 255, 255, 0.7)",
  minWidth: "40px",
});

const Navigation: React.FC<NavigationProps> = ({ open, onClose }) => {
  const location = useLocation();

  const isCurrentPage = (path: string): boolean => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Home", icon: <Home /> },
    { path: "/profile/1", label: "Profile", icon: <Person /> },
    { path: "/lobby/poker", label: "Poker Lobby", icon: <Casino /> },
    { path: "/lobby/blackjack", label: "Blackjack Lobby", icon: <Casino /> },
    { path: "/lobby/roulette", label: "Roulette Lobby", icon: <Casino /> },
    { path: "/livegames", label: "Live Games", icon: <Dashboard /> },
  ];

  return (
    <StyledDrawer anchor="left" open={open} onClose={onClose}>
      <Box onClick={onClose} sx={{ pt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem disablePadding>
                <StyledListItemButton
                  className={isCurrentPage(item.path) ? "active" : ""}
                >
                  <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "0.95rem",
                        fontWeight: isCurrentPage(item.path) ? 600 : 400,
                      },
                    }}
                  />
                </StyledListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Navigation;
