import axios from "axios";
//import auth from "../config/firebase";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const instance = axios.create({
    baseURL: apiUrl, 
    withCredentials: true,
});


instance.interceptors.response.use(response => {

    return response;
}, error => {

    return Promise.reject(error);
});

export default instance;