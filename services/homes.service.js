import api from "./api";

export const getAllHomes = async () => {
  const response = await api.get("/homes/getHomes");
  return response.data;
};

export const getHome = async (homeId) => {
  const response = await api.get(`/homes/getHome/${homeId}`);
  return response.data;
};

export const getHomeById = async (homeId) => {
  const response = await api.get(`/homes/getHomeById/${homeId}`);
  return response.data;
};

export const getHomeDevices = async (homeId) => {
  const response = await api.get(`/devices/getDevicesByHome/${homeId}`);
  return response.data;
};

export const createHome = async (homeData) => {
  const response = await api.post("/homes/createHome", homeData);
  return response.data;
};

export const updateHome = async (homeId, homeData) => {
  const response = await api.put(`/homes/updateHome/${homeId}`, homeData);
  return response.data;
};

export const deleteHome = async (homeId) => {
  const response = await api.delete(`/homes/deleteHomeById/${homeId}`);
  return response.data;
};
