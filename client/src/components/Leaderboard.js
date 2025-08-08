import { useEffect, useState } from "react";
import { getCrownColor, getCardStyle } from "../styles/LeaderboardStyles";
import { fetchTopUsers } from "../services/api";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    image_url: "",
    score: "",
  });
  const [updateData, setUpdateData] = useState({ id: "", score: "" });

  const loadUsers = async () => {
    const data = await fetchTopUsers(10);
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <>
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
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add new user
        </Button>
        <Button variant="outlined" onClick={() => setOpenUpdate(true)}>
          Update user rank
        </Button>
      </Stack>
    </>
  );
};

export default Leaderboard;
