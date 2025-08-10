const API_BASE =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3000");

const config = { API_BASE };
export default config;
