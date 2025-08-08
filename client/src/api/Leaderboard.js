import { useEffect, useState } from 'react';

const API = 'http://localhost:3000/leaderboard/top/10';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Error loading leaderboard', err));
  }, []);

  return (
    <ul>
      {users.map((user, index) => (
        <li key={user.id}>
          #{index + 1} - {user.name} ({user.score} pts)
        </li>
      ))}
    </ul>
  );
};

export default Leaderboard;
