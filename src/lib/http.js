import axios from "axios";

const http = (options = {}) => {
  const token = localStorage.getItem("token"); // Ensure token is stored in local storage
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  return axios.create({
    baseURL: import.meta.env.VITE_API || "http://127.0.0.1:8000/api",
    headers,
    withCredentials: true, // Include this line to ensure cookies are sent
  });
};

export default http;
