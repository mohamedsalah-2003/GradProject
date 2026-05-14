import api from "./api";

export const getAllDevices = async (body) => {

  const response = await api.get("/devices/getDevices", body);

  return response.data;
};

