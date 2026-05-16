import axios from "axios";
import api from "./api";

export const getAnalytics = async (range) => {
  const response = await api.get("/analytics", { params: { range } });
  return response.data;
};