import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const env = process.env.NODE_ENV;

const apiUrl = import.meta.env.VITE_API_URL;

// "https://ai-chat-f9db.onrender.com"

const prodServer = "http://localhost:3000";
const devServer = "http://localhost:3000";

export let serverName = "";

console.log(prodServer, devServer, env);

if (env == "production") {
  serverName = apiUrl || prodServer;
}
else if (env == "staging") {
  serverName = devServer;
}
else {
  serverName = devServer;
}

export const apiClient = axios.create({
  baseURL: serverName + "/api/v1",
});

async function handleTokenMiddlewareError(error: AxiosError) {
  const originalRequest = error.config as InternalAxiosRequestConfig<any>;

  const responseData = error.response?.data as any;

  if (responseData?.error === "expired") {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const { data } = await axios.post(`${serverName}/api/v1/auth/refresh`, {
        refreshToken,
      });

      localStorage.setItem("accessToken", data.data.accessToken);

      originalRequest.headers["Authorization"] = `Bearer ${data.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      console.error("Refresh token request failed", refreshError);
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
}

async function handleRequestTokenMiddleware(config: InternalAxiosRequestConfig<any>) {
  const token = localStorage.getItem("accessToken");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}

async function handleResponseTokenMiddleware(value: AxiosResponse<any, any>) {
  if (value.data.data && value.data.data.accessToken) {
    localStorage.setItem("accessToken", value.data.data.accessToken);
  }

  if (value.data.data && value.data.data.refreshToken) {
    localStorage.setItem("refreshToken", value.data.data.refreshToken);
  }

  return value;
}

apiClient.interceptors.request.use(handleRequestTokenMiddleware, handleTokenMiddlewareError);
apiClient.interceptors.response.use(handleResponseTokenMiddleware, handleTokenMiddlewareError);