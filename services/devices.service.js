import api from "./api";

export const getAllDevices = async (body) => {

  const response = await api.get("/devices/getDevices", body);

  return response.data;
};

export const getDevice = async (deviceId) => {
  const response = await api.get(`/devices/getDevice/${deviceId}`);
  return response.data;
};

export const addDevice = async (deviceData) => {
  const response = await api.post("/devices/createDevice", deviceData);
  return response.data;
};

export const updateDevice = async (deviceId, deviceData) => {
  const response = await api.put(`/devices/updateDevice/${deviceId}`, deviceData);
  return response.data;
};

export const deleteDevice = async (deviceId) => {
  const response = await api.delete(`/devices/deleteDevice/${deviceId}`);
  return response.data;
};

