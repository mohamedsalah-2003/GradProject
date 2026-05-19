import api  from "./api";


export const getEmergencyContacts = async () => {
  const response  = await api.get("/users/emergency-contacts");
  return response.data;
};

export const addEmergencyContact = async (payload: { name: string; phone: string }) => {
  const { data } = await api.post("/users/emergency-contacts", payload);
  return data;
};

export const updateEmergencyContact = async (
  contactId: string,
  payload: { name: string; phone: string }
) => {
  const { data } = await api.put(`/users/emergency-contacts/${contactId}`, payload);
  return data;
};

export const deleteEmergencyContact = async (contactId: string) => {
  const { data } = await api.delete(`/users/emergency-contacts/${contactId}`);
  return data;
};