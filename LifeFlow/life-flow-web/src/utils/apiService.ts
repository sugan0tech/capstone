import axios from "axios";
import {getAccessToken} from "./authApiService.ts";

const baseURL = "https://donationservice.azurewebsites.net/api/";
// const baseURL = "http://localhost:5226/api/";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const newAccessToken = await getAccessToken(refreshToken);
            localStorage.setItem("accessToken", newAccessToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (e) {
            clearAuthTokens();
            window.location.href = "/login";
            return Promise.reject(error);
          }
        } else {
          clearAuthTokens();
          window.location.href = "/login";
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
);
function clearAuthTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAuthenticated");
  localStorage.clear();
}

function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("isAuthenticated", "true");
}

async function logout() {
  const token = localStorage.getItem("refreshToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  clearAuthTokens();
  await api.post("/Auth/logout", null, config);
}

// Generic API methods
async function get<T>(endpoint: string): Promise<T> {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "An unexpected error occurred during";
      const errorStatus = error.response.data?.status || error.response.status;
      throw new Error(`${errorMessage} (Status: ${errorStatus})`);
    }
    throw new Error("An unexpected error occurred");
  }
}

async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "An unexpected error occurred";
      const errorStatus = error.response.data?.status || error.response.status;
      throw new Error(`${errorMessage} (Status: ${errorStatus})`);
    }
    throw new Error("An unexpected error occurred");
  }
}

async function put<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "An unexpected error occurred";
      const errorStatus = error.response.data?.status || error.response.status;
      throw new Error(`${errorMessage} (Status: ${errorStatus})`);
    }
    throw new Error("An unexpected error occurred");
  }
}

async function del<T>(endpoint: string): Promise<T> {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "An unexpected error occurred";
      const errorStatus = error.response.data?.status || error.response.status;
      throw new Error(`${errorMessage} (Status: ${errorStatus})`);
    }
    throw new Error("An unexpected error occurred");
  }
}

export { api, logout, setAuthTokens, get, post, put, del , baseURL};
