import axiosInstance from "./axiosInstance";

const unwrap = (response) => response.data?.data ?? response.data;

export const login = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return unwrap(response);
};

export const register = async (payload) => {
  const response = await axiosInstance.post("/auth/register", payload);
  return unwrap(response);
};

export const fetchProfile = async () => {
  const response = await axiosInstance.get("/auth/me");
  return unwrap(response);
};
