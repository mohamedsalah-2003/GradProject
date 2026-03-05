import { isValidEmail, isStrongPassword } from "./validators.js";

export type LoginErrors = {
  email?: string;
  password?: string;
};

export const validateLoginForm = (data: { email: string; password: string }) => {
  const errors: LoginErrors = {};

  const email = String(data.email ?? "").trim();
  const password = String(data.password ?? "");

  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email";

  if (!password.trim()) errors.password = "Password is required";
  else if (!isStrongPassword(password))
    errors.password = "Invalid password format";

  return { errorsObj: errors };
};