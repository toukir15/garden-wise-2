import { envConfig } from "@/src/config/envConfig";
import axios from "axios";

const axiosClientInstance = axios.create({
  baseURL: `${envConfig.baseApi}`,
});

axiosClientInstance.interceptors.request.use(
  function (config) {
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
    const accessToken = match ? decodeURIComponent(match[1]) : undefined;
    if (accessToken) config.headers.Authorization = accessToken;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClientInstance;
