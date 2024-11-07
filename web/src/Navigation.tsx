import { Link } from "react-router-dom";

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

const Navigation: React.FC = () => {
  const drawerWidth = 300;

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    // <div style={{ display: "flex", flexDirection: "row" }}>
    //   <nav>
    //     <ul style={{ listStyle: "none", textAlign: "left" }}>
    //       <li>
    //         <Link style={{ textDecoration: "none" }} to="/">
    //           Home
    //         </Link>
    //       </li>
    //       <li>
    //         <Link style={{ textDecoration: "none" }} to="/game">
    //           Game
    //         </Link>
    //       </li>
    //       <li>
    //         <Link style={{ textDecoration: "none" }} to="/chat">
    //           Chat
    //         </Link>
    //       </li>
    //     </ul>
    //   </nav>
    // </div>
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
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <Inbox /> : <Mail />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Navigation;
