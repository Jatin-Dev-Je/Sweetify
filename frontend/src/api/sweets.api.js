import axiosInstance from "./axiosInstance";

export const fetchSweets = async (query = "") => {
  const { data } = await axiosInstance.get("/sweets", {
    params: query ? { search: query } : undefined,
  });
  return data;
};

export const createSweet = async (payload) => {
  const { data } = await axiosInstance.post("/sweets", payload);
  return data;
};

export const updateSweet = async (sweetId, payload) => {
  const { data } = await axiosInstance.put(`/sweets/${sweetId}`, payload);
  return data;
};

export const deleteSweet = async (sweetId) => {
  const { data } = await axiosInstance.delete(`/sweets/${sweetId}`);
  return data;
};

export const purchaseSweet = async (sweetId, payload = { quantity: 1 }) => {
  const { data } = await axiosInstance.post(`/sweets/${sweetId}/purchase`, payload);
  return data;
};

export const restockSweet = async (sweetId, payload = { quantity: 1 }) => {
  const { data } = await axiosInstance.post(`/sweets/${sweetId}/restock`, payload);
  return data;
};
