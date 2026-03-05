import { useState } from "react";
import { validateLoginForm, LoginErrors } from "../../utils/Auth/loginValidation";

type FocusField = null | "email" | "password";

export default function useLoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [secure, setSecure] = useState<boolean>(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [focusedField, setFocusedField] = useState<FocusField>(null);

  const clearError = (field: keyof LoginErrors) => {
    setErrors((prev) => (!prev[field] ? prev : { ...prev, [field]: undefined }));
  };

  const validate = () => {
    const result = validateLoginForm({ email, password });
    const errorsObj = result.errorsObj || {};
    setErrors(errorsObj);
    return { ok: Object.keys(errorsObj).length === 0, payload: { email, password } };
  };

  return {
    values: { email, password },
    setters: { setEmail, setPassword },
    ui: { secure, setSecure, focusedField, setFocusedField },
    errors,
    actions: { clearError, validate },
  };
}