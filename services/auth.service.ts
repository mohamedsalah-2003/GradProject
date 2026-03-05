import api from "./api";

export const signupRequest = async (data: any) => {
  const response = await api.post("/users/signup", data);
  return response.data;
};

export const signinRequest = async (data: any) => {
  const response = await api.post("/users/signin", data);
  return response.data;
};