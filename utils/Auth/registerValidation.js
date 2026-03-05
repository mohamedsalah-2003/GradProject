// root/utils/registerValidation.js
import {
  isAlphanumeric,
  isStrongPassword,
  isValidDateOfBirth,
  isValidEmail,
  isValidGender,
  isValidPhoneNumber,
  toUpperTrim,
} from "./validators";

const addError = (errorsObj, errorsArray, field, message) => {
  if (!errorsObj[field]) errorsObj[field] = message;
  errorsArray.push({ field, message });
};

export const validateRegisterForm = ({
  firstname,
  lastname,
  email,
  password,
  confirmPassword,
  dateOfBirth, // ✅ backend name
  gender,
  phoneNumber,
  
}) => {
  const errorsObj = {};
  const errorsArray = [];

  const fn = String(firstname ?? "").trim();
  const ln = String(lastname ?? "").trim();
  const em = String(email ?? "").trim();
  const pw = String(password ?? "");
  const cpw = String(confirmPassword ?? "");
  const dob = String(dateOfBirth ?? "").trim();
  const gen = toUpperTrim(gender);
  const phone = String(phoneNumber ?? "").trim();

  // firstname: required, alphanumeric, 3-20
  if (!fn) addError(errorsObj, errorsArray, "firstname", "First name is required");
  else {
    if (fn.length < 3) addError(errorsObj, errorsArray, "firstname", "First name must be at least 3 characters long");
    else if (fn.length > 20) addError(errorsObj, errorsArray, "firstname", "First name must be at most 20 characters long");
    else if (!isAlphanumeric(fn)) addError(errorsObj, errorsArray, "firstname", "First name must be alphanumeric");
  }

  // lastname: required, alphanumeric, 3-20
  if (!ln) addError(errorsObj, errorsArray, "lastname", "Last name is required");
  else {
    if (ln.length < 3) addError(errorsObj, errorsArray, "lastname", "Last name must be at least 3 characters long");
    else if (ln.length > 20) addError(errorsObj, errorsArray, "lastname", "Last name must be at most 20 characters long");
    else if (!isAlphanumeric(ln)) addError(errorsObj, errorsArray, "lastname", "Last name must be alphanumeric");
  }

  // email: required, valid
  if (!em) addError(errorsObj, errorsArray, "email", "Email is required");
  else if (!isValidEmail(em)) addError(errorsObj, errorsArray, "email", "Please enter a valid email");

  // phoneNumber: required, valid
  if (!phone) addError(errorsObj, errorsArray, "phoneNumber", "Phone number is required");
  else if (!isValidPhoneNumber(phone)) addError(errorsObj, errorsArray, "phoneNumber", "Invalid phone number");

  // dateOfBirth: required, ISO, before now
  if (!dob) addError(errorsObj, errorsArray, "dateOfBirth", "Date of birth is required");
  else if (!isValidDateOfBirth(dob)) addError(errorsObj, errorsArray, "dateOfBirth", "Invalid date of birth");

  // gender: docs say optional, but if you want required keep this block
  // لو عايزه optional احذف شرط !gen وخليها تتحقق بس لو موجودة
  if (!gen) addError(errorsObj, errorsArray, "gender", "Gender is required");
  else if (!isValidGender(gen)) addError(errorsObj, errorsArray, "gender", "Invalid gender");

  // password: required + strong
  if (!pw.trim()) addError(errorsObj, errorsArray, "password", "Password is required");
  else if (!isStrongPassword(pw))
    addError(
      errorsObj,
      errorsArray,
      "password",
      "Password must be at least 8 chars and include upper, lower, number, and symbol"
    );

  // confirmPassword: required + match
  if (!cpw.trim()) addError(errorsObj, errorsArray, "confirmPassword", "Please confirm your password");
  else if (pw !== cpw) addError(errorsObj, errorsArray, "confirmPassword", "Passwords do not match");

  return { errorsObj, errorsArray };
};