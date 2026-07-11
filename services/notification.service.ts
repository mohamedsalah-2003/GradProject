// services/notification.service.ts — لازم تتعمل
import api from "./api";



export const removeFcmTokenRequest =async (data: { token: string }) =>{
  const response = await api.delete("/notifications/remove-token", {data} );
  return response.data;
};

export const updateFcmTokenRequest = async (data: { token: string; platform: string; deviceName?: string }) => {
  const response = await api.post("/notifications/register-token", data);
  return response.data;
};
