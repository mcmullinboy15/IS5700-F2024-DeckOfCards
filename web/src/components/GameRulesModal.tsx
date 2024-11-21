import { useState } from "react";
import {
   IconButton,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   Box,
   Tabs,
   Tab,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}

interface GameRulesData {
   basics: React.ReactNode;
   hands: React.ReactNode;
   betting: React.ReactNode;
}

interface GameRulesModalProps {
   gameTitle: string;
   rulesData: GameRulesData;
}

function TabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;
   return (
      <div role="tabpanel" hidden={value !== index} {...other} className="p-4">
         {value === index && <Box>{children}</Box>}
      </div>
   );
}

const GameRulesModal = ({ gameTitle, rulesData }: GameRulesModalProps) => {
   const [open, setOpen] = useState(false);
   const [tabValue, setTabValue] = useState(0);

   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);
   const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
   };

   return (
      <>
         <IconButton onClick={handleOpen} color="inherit">
            <HelpIcon />
         </IconButton>

         <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{gameTitle} Rules</DialogTitle>

            <DialogContent>
               <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
               >
                  <Tab label="Basics" />
                  <Tab label="Hands" />
                  <Tab label="Betting" />
               </Tabs>

               <TabPanel value={tabValue} index={0}>
                  {rulesData.basics}
               </TabPanel>
               <TabPanel value={tabValue} index={1}>
                  {rulesData.hands}
               </TabPanel>
               <TabPanel value={tabValue} index={2}>
                  {rulesData.betting}
               </TabPanel>
            </DialogContent>

            <DialogActions>
               <Button onClick={handleClose}>Close</Button>
            </DialogActions>
         </Dialog>
      </>
   );
};

export default GameRulesModal;
