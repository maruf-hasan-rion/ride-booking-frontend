import config from "@/config";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
  timeout: 15000,
});

axiosInstance.interceptors.request.use((request) => {
  const method = (request.method || "get").toUpperCase();

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    request.headers.set("X-Requested-With", "XMLHttpRequest");
  }

  return request;
});
