import axios from "axios";
import api from "./api";

export const getUserAlerts = async () => {
  const response = await api.get("/alerts");
  return response.data;
};

export const getAlertById = async (id) => {
  const response = await api.get(`/alerts/${id}`);
  return response.data;
};

export const markAlertAsRead = async (id) => {
  const response = await api.patch(`/alerts/${id}/read`);
  return response.data;
};
export const markAlertAsResolved = async (id) => {
    const response = await api.patch(`/alerts/${id}/resolved`);
    return response.data;
};