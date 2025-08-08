import { useEffect, useState } from "react";
import { getCrownColor, getCardStyle } from "./styles/LeaderboardStyles";
import { fetchTopUsers } from "./services/api";
import { Card, CardContent, Typography, Avatar, Stack } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";


const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTopUsers()
    .then(setUsers)
    .catch((err) => console.error("Error fetching leaderboard", err));
  }, []);

  return (
    <Stack spacing={2}>
      {users.map((user, index) => (
        <Card key={user.id} variant="outlined" style={getCardStyle(index)}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack alignItems="center" spacing={0.5}>
                <EmojiEventsIcon
                  style={{ color: getCrownColor(index), fontSize: 32 }}
                />
                <Typography variant="caption">#{index + 1}</Typography>
              </Stack>
              <Avatar src={user.image_url} alt={user.name} />
              <Stack>
                <Typography>{user.name}</Typography>
                <Typography color="text.secondary">
                  Score: {user.score}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default Leaderboard;
