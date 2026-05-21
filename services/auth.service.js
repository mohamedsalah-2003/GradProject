import api from "./api";
import { storage } from "../utils/storage";


export const signupRequest = async (body) => {

  const response = await api.post("/users/signup", body);

  return response.data;
};

export const signinRequest = async (body) => {
  const response = await api.post("/users/signin", body);
  return response.data;
};
export const signoutRequest = async () => {
  const response = await api.post("/users/logout", {}, {
    headers: {
      "refreshtoken": await storage.get("refreshtoken"),
      "accesstoken": await storage.get("accesstoken")
    }
  });
  return response.data;
};
export const refreshTokenRequest = async () => {
  const response = await api.post("/users/refresh-token", {}, {
    headers: {
      "refreshtoken": await storage.get("refreshtoken")
    }
  });
  return response.data;
};