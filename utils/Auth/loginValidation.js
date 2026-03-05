import { isValidEmail, isStrongPassword } from "./validators";


export const validateLoginForm = (data) => {
  const errors = {};

  const email = String(data.email ?? "").trim();
  const password = String(data.password ?? "");

  if (!email) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email";

  if (!password.trim()) errors.password = "Password is required";
  else if (!isStrongPassword(password))
    errors.password = "Invalid password format";

  return { errorsObj: errors };
};