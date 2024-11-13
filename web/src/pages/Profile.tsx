import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { userId } = useParams();

if (!authContext) {
    return <div>Loading...</div>
}

  if (authContext) {
    
    const user = {
        id: 1,
        email: "bob@gmail.com",
        firstname: "Bobby",
        lastname: "Mcgee",
    }
  return (
    <>
      <Container fixed>
        <Box
          sx={{
            bgcolor: "#cfe8fc",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
          display="flex"
          flexDirection="row"
        >
          <Avatar
            sx={{
              bgcolor: deepOrange[500],
              height: "15vh",
              width: "15vh",
              fontSize: 80,
            }}
          >
            {user?.firstname[0]} {/* TODO GRAB THE FIRST LETTER CORRECTLY */}
          </Avatar>
          <Typography variant="h2" gutterBottom>
            {user?.firstname} {user?.lastname}
          </Typography>
        </Box>
        <Box display="flex" justifyContent={"center"}>
            <Typography variant="h4" gutterBottom>
                Email: {user?.email}
            </Typography>
        </Box>
      </Container>
    </>
  );
}
}
