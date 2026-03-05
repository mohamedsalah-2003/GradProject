import api from "./api";

export const signupRequest = async (body) => {

  const response = await api.post("/users/signup", body);

  return response.data;
};

export const signinRequest = async (body) => {
  const response = await api.post("/users/signin", body);
  return response.data;
};