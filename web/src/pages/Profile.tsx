import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const ProfileCard = styled(motion.div)({
  backgroundColor: "rgba(17, 25, 40, 0.75)",
  borderRadius: "12px",
  overflow: "hidden",
  padding: "2rem",
  width: "100%",
  marginTop: "2rem",
});

const StyledAvatar = styled(Avatar)({
  border: "3px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
});

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
    return <LoadingSpinner />;
  }

  if (profile) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
          color: "white",
          pb: 8,
          pt: 4,
        }}
      >
        <Container maxWidth="lg">
          <ProfileCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: 4, md: 8 },
                mb: 6,
              }}
            >
              <StyledAvatar
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.9)",
                  height: { xs: "120px", md: "150px" },
                  width: { xs: "120px", md: "150px" },
                  fontSize: { xs: 48, md: 64 },
                }}
              >
                {profile.displayName?.[0]?.toUpperCase()}
              </StyledAvatar>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {profile.displayName}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    opacity: 0.8,
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                  }}
                >
                  {profile.email}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                mt: 4,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 2,
                }}
              >
                Profile Details
              </Typography>
              <Typography
                sx={{
                  opacity: 0.7,
                }}
              >
                User ID: {profile.uid}
              </Typography>
            </Box>
          </ProfileCard>
        </Container>
      </Box>
    );
  }
}
