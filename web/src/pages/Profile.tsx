import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export function ProfileWrapper() {
  const { userId } = useParams();

  if (!userId) {
    return <div>No user id specified</div>;
  }

  // TODO: fetch user

  const user: Partial<User> = {
    // dummy data  TODO: get from the database with userId
    uid: userId as string,
    email: "bob@gmail.com",
    displayName: "Bobby McGee",
  };

  return <Profile user={user} />;
}

export function Profile({ user }: { user: Partial<User> }) {
  const [profile, setProfile] = useState<Partial<User> | null>(null);

  useEffect(() => {
    if (user && !profile) {
      setProfile(user);
    }
  }, [user]);

  if (!profile) {
    return <LoadingSpinner/>;
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
              {profile.displayName?.[0]}{" "}
              {/* TODO GRAB THE FIRST LETTER CORRECTLY */}
            </Avatar>
            <Typography variant="h2" gutterBottom>
              {profile.displayName}
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
