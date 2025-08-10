import { useEffect, useState } from "react";
import { getCrownColor, getCardStyle } from "../styles/LeaderboardStyles";
import { fetchTopUsers, addUser, updateUserScore, fetchAllUsers } from "../services/api";
import {
  Card, CardContent, Typography, Avatar, Stack, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import config from "../config";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    image_url: "",
    score: 0,
  });
  const [updateData, setUpdateData] = useState({ id: "", score: "" });
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);


  const loadUsers = async () => {
    const data = await fetchTopUsers(10);
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (openUpdate) {
      setLoadingUsers(true);
      fetchAllUsers()
        .then(setAllUsers)
        .finally(() => setLoadingUsers(false));
    }
  }, [openUpdate]);


  const handleAddUser = async () => {
    await addUser({ ...newUser });
    setOpenAdd(false);
    setNewUser({ name: "", image_url: "", score: 0 });
    loadUsers();
  };

  const handleUpdateScore = async () => {
    await updateUserScore(updateData.id, Number(updateData.score));
    setOpenUpdate(false);
    setUpdateData({ id: "", score: "" });
    loadUsers();
  };

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
        <Button variant="contained" onClick={() => setOpenAdd(true)}>Add new user</Button>
        <Button variant="outlined" onClick={() => setOpenUpdate(true)}>Update user rate</Button>
      </Stack>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add new user</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" fullWidth value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <TextField label="Image url" fullWidth value={newUser.image_url}
              onChange={(e) => setNewUser({ ...newUser, image_url: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)}>
  <DialogTitle>Update gamer rate</DialogTitle>
  <DialogContent>
    <Stack spacing={2} mt={1}>
      <Autocomplete
        loading={loadingUsers}
        options={allUsers}
        getOptionLabel={(u) => u?.name ?? ''}
        onChange={(e, user) =>
          setUpdateData({ ...updateData, id: user?.id ?? '' })
        }
        renderOption={(props, option) => (
          <li {...props} key={option.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar src={option.image_url} alt={option.name} />
            <span>{option.name}</span>
            <Typography variant="caption" style={{ marginLeft: 'auto', opacity: 0.7 }}>
              Score: {option.score}
            </Typography>
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Choose user" placeholder="Search by name" />
        )}
      />

      <TextField
        label="Updated score"
        type="number"
        fullWidth
        value={updateData.score}
        onChange={(e) => setUpdateData({ ...updateData, score: e.target.value })}
      />
    </Stack>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenUpdate(false)}>Cancel</Button>
    <Button
      variant="contained"
      onClick={handleUpdateScore}
      disabled={!updateData.id || updateData.score === ''}
    >
      Ok
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default Leaderboard;
