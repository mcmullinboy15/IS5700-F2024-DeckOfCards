// import {
//   Drawer,
//   IconButton,
//   Divider,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemButton,
//   ListItemText,
// } from "@mui/material";
// import { ChevronLeft, Inbox, Mail } from "@mui/icons-material";
// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";

// const Navigation: React.FC = () => {
//   const drawerWidth = 300;

//   const [open, setOpen] = useState(false);

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   const location = useLocation();

//   const isActive = (path: string): boolean => {
//     return location.pathname === path;
//   };

//   return (
//     <Drawer
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: drawerWidth,
//           boxSizing: "border-box",
//         },
//       }}
//       variant="persistent"
//       anchor="left"
//       open={open}
//     >
//       <div>
//         <IconButton onClick={handleDrawerClose}>
//           <ChevronLeft />
//         </IconButton>
//       </div>
//       <Divider />
//       <List>
//         {["/", "/game", "/chat"].map((path, index) => (
//           <ListItem key={path} disablePadding>
//             <ListItemButton
//               component={Link}
//               to={path}
//               sx={{
//                 backgroundColor: isActive(path)
//                   ? "rgba(0, 0, 0, 0.08)" // Highlight active item
//                   : "transparent",
//               }}
//             >
//               <ListItemIcon>
//                 {index % 2 === 0 ? <Inbox /> : <Mail />}
//               </ListItemIcon>
//               <ListItemText primary={path.slice(1) || "Home"} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {["/all-mail", "/trash", "/spam"].map((path, index) => (
//           <ListItem key={path} disablePadding>
//             <ListItemButton
//               component={Link}
//               to={path}
//               sx={{
//                 backgroundColor: isActive(path)
//                   ? "rgba(0, 0, 0, 0.08)" // Highlight active item
//                   : "transparent",
//               }}
//             >
//               <ListItemIcon>
//                 {index % 2 === 0 ? <Inbox /> : <Mail />}
//               </ListItemIcon>
//               <ListItemText primary={path.slice(1)} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Drawer>
//   );
// };



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

interface NavigationProps {
  open: boolean;
  onClose: () => void;
}

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
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 250,
        },
      }}
    >
      <Box onClick={onClose}>
        <List>
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    backgroundColor: isCurrentPage(item.path)
                      ? "rgba(0, 0, 0, 0.08)"
                      : "transparent",
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
export default Navigation;
	