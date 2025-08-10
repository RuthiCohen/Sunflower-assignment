import config from "../config";

const API_BASE = config.API_BASE;

export const fetchTopUsers = async (n = 10) => {
  const res = await fetch(`${API_BASE}/leaderboard/top/${n}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
};

export const addUser = async ({ name, image_url }) => {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, image_url }),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
};

export const updateUserScore = async (id, score) => {
  try {
    const res = await fetch(`${API_BASE}/users/${id}/score`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Network or server error:", err);
    throw err;
  }
};

export const getUserWithContext = async (id) => {
  const res = await fetch(`${API_BASE}/leaderboard/user/${id}`);
  if (!res.ok) throw new Error("Failed to get user context");
  return res.json();
};

export const fetchAllUsers = async () => {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};
