import axios from "axios";

// Create an axios instance with the given options
const http = (options = {}) => {
  const token = localStorage.getItem("token"); // Get token from local storage
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`, // Include token in headers
    ...options.headers,
  };

  return axios.create({
    baseURL: import.meta.env.VITE_API || "http://127.0.0.1:8000/api",
    headers,
  });
};

export default http;
