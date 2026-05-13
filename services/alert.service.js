import axios from "axios";
import { storage } from "../utils/storage";

const API_URL = "http://localhost:3000/alerts";

export const alertService = {
getAllAlerts: async () => {
    try {
        const token = await storage.get("accesstoken");
        
        const response = await axios.get("http://localhost:3000/alerts", {
            headers: { 
                
                'accesstoken': token 
            }
        });
        return response.data;
    } catch (error) {
        console.error("Alert Service Error:", error.response?.data);
        throw error;
    }
},

 markAsRead: async (id) => {
    const token = await storage.get("accesstoken");
    await axios.patch(`${API_URL}/${id}/read`, {}, {
      
      headers: { 'accesstoken': token }
    });
}
};