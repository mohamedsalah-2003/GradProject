import axios from "axios";
import { BASE_URL } from "../config/env";
import { storage } from "./../utils/storage";
import { router } from "expo-router";

const api = axios.create({
    baseURL: BASE_URL,
});
api.interceptors.request.use(
    async (config) => {
        const token = await storage.get("accesstoken");

        if (token) {
            config.headers = config.headers ?? {};
            config.headers["accesstoken"] = token;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 500) {
            console.log("Unauthorized - token expired");

            // هنا قرارك:
            // 1) logout user
            // 2) refresh token flow
            // 3) redirect to login
            router.push("/login"); // Redirect to login page
        }

        return Promise.reject(error);
    }
);
export default api;