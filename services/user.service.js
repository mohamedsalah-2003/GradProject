import axios from "axios";
import { storage } from "../utils/storage";

const API_URL = "http://localhost:3000/users";

export const userService = {
    updatePassword: async (oldPassword, newPassword) => {

        const token = await storage.get("accesstoken");

        console.log("TOKEN:", token);

        const response = await axios.put(
            `${API_URL}/updatePassword`,
            { oldPassword, newPassword },
            {
                headers: {
                    accesstoken: token
                }
            }
        );

        return response.data;
    }
};