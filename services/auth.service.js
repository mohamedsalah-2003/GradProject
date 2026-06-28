import { storage } from "../utils/storage";
import api from "./api";


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

export const confirmEmailRequest = async (body) => {
  const response = await api.put("/users/confirm", body);
  return response.data;
};