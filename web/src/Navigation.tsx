import {
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ChevronLeft, Inbox, Mail } from "@mui/icons-material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation: React.FC = () => {
  const drawerWidth = 300;

  const [open, setOpen] = useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <div>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeft />
        </IconButton>
      </div>
      <Divider />
      <List>
        {["/", "/game", "/chat"].map((path, index) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              sx={{
                backgroundColor: isActive(path)
                  ? "rgba(0, 0, 0, 0.08)" // Highlight active item
                  : "transparent",
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={path.slice(1) || "Home"} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["/all-mail", "/trash", "/spam"].map((path, index) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              sx={{
                backgroundColor: isActive(path)
                  ? "rgba(0, 0, 0, 0.08)" // Highlight active item
                  : "transparent",
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={path.slice(1)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation;
