import { Container, Typography } from "@mui/material";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        🏆 Leaderboard
      </Typography>
      <Leaderboard />
    </Container>
  );
}

export default App;
