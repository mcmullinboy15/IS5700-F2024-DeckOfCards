import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import "./Header.css";

export default function Header() {

  const boxes = ["box 1", "box 2", "box 3", "box 4"];

  return (
    <AppBar sx={{  top: 0 }} position="sticky">
     
     <Box>
      Poker Game
     </Box>
      
      <Stack justifyContent="center" direction="row" spacing={4}>
        {boxes.map((box) => (
        
        <Box
        sx={{ padding: 1 }}
          width={100}
          height={100}
          bgcolor="lightblue"
          m={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {box}
        </Box>
        ))}
       
      </Stack>
    </AppBar>
  );
}
