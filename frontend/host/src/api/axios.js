import axios from "axios";
import auth from "../config/firebase";

const apiUrl = import.meta.env.VITE_APP_FIREBASE_API_KEY;

const instance = axios.create({
    baseURL: apiUrl, 

});

instance.interceptors.request.use(async(config) => {
    const user = auth.currentUser;
    if (user) {  
        try {
            const idToken = await user.getIdToken();
            config.headers.Authorization = `Bearer ${idToken}`;
        } catch (error) {
            console.error("Error getting ID token:", error);
        }
    }

    return config;
}, error => {

    return Promise.reject(error);
});

instance.interceptors.response.use(response => {

    return response;
}, error => {

    return Promise.reject(error);
});

export default instance;