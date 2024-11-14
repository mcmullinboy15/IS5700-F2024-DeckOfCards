import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { User } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Profile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<User | null>(null);

  const user: User = {
    // dummy data  TODO: get from the database with userId
    id: userId as string,
    email: "bob@gmail.com",
    firstname: "Bobby",
    lastname: "Mcgee",
  };

  useEffect(() => {
    if (user && !profile) {
      setProfile(user);
    }
  }, [user]);

  if (!profile) {
    return <div>Loading...</div>; // TODO: insert loading modal
  }

  if (profile) {
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
              {profile.firstname[0]}{" "}
              {/* TODO GRAB THE FIRST LETTER CORRECTLY */}
            </Avatar>
            <Typography variant="h2" gutterBottom>
              {profile.firstname} {profile.lastname}
            </Typography>
          </Box>
          <Box display="flex" justifyContent={"center"}>
            <Typography variant="h4" gutterBottom>
              Email: {profile.email}
            </Typography>
          </Box>
        </Container>
      </>
    );
  }
}
