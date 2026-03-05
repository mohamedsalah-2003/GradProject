import { useMemo, useState } from "react";
import { computeAgeFromDob, normalizePhoneNumber } from "../../utils/Auth/validators";
import { validateRegisterForm } from "../../utils/Auth/registerValidation";

export type RegisterErrors = {
  firstname?: string;
  lastname?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
};

type FocusField =
  | null
  | "firstname"
  | "lastname"
  | "email"
  | "phoneNumber"
  | "dateOfBirth"
  | "dob"
  | "gender"
  | "password"
  | "confirmPassword";

export default function useRegisterForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [gender, setGender] = useState<"" | "male" | "female">("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secure, setSecure] = useState(true);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [focusedField, setFocusedField] = useState<FocusField>(null);

  const computedAge = useMemo(() => computeAgeFromDob(dob), [dob]);

  const clearError = (field: keyof RegisterErrors) => {
    setErrors((prev) => (!prev[field] ? prev : { ...prev, [field]: undefined }));
  };

  const setPhone = (t: string) => {
    const cleaned = normalizePhoneNumber(t);
    setPhoneNumber(cleaned);
    clearError("phoneNumber");
  };

  const buildPayload = () => ({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    dateOfBirth: dob,
    gender, // ✅ mock payload wants "male" | "female"
    phoneNumber,
  });

  const validate = () => {
    const payload = buildPayload();

    const result = validateRegisterForm(payload as any);
    const errorsObj: RegisterErrors = (result as any)?.errorsObj || (result as any)?.errors || {};

    setErrors(errorsObj);
    return { ok: Object.keys(errorsObj).length === 0, payload };
  };

  return {
    values: { firstname, lastname, dob, gender, phoneNumber, email, password, confirmPassword },
    setters: { setFirstname, setLastname, setDob, setGender, setEmail, setPassword, setConfirmPassword },
    ui: { secure, setSecure, focusedField, setFocusedField, computedAge },
    errors,
    actions: { clearError, setPhone, validate, buildPayload },
  };
}