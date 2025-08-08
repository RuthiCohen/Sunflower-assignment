const dev = {
    API_BASE: "http://localhost:3000",
  };
  
  const prod = {
    API_BASE: process.env.REACT_APP_API_URL,
  };
  
  const config = process.env.NODE_ENV === "production" ? prod : dev;
  
  export default config;
  