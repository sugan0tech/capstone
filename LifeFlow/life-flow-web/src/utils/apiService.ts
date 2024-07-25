import axios from "axios";

const baseURL = "http://localhost:5226/api/";

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
          const response = await api.get("/Auth/access-token", {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          localStorage.setItem("accessToken", response.data.accessToken);
          api.defaults.headers.common["Authorization"] =
            `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } catch (e) {
          clearAuthTokens();
          window.location.href = "/login";
        }
      } else {
        clearAuthTokens();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

function clearAuthTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("isAuthenticated");
}

function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("isAuthenticated", "true");
}

async function login(email: string, password: string, staySigned: boolean) {
  const response = await api.post("/Auth/login", {
    email,
    password,
    staySigned,
  });

  if (response.status != 200) {
    throw new Error(response.data);
  }
  setAuthTokens(response.data.accessToken, response.data.refreshToken);
  return response.data;
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
  const response = await api.get(endpoint);
  if (response.status != 200) {
    throw new Error(response.data);
  }
  return response.data;
}

async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await api.post(endpoint, data);
  if (response.status != 200) {
    throw new Error(response.data);
  }
  return response.data;
}

async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await api.put(endpoint, data);
  if (response.status != 200) {
    throw new Error(response.data);
  }
  return response.data;
}

async function del<T>(endpoint: string): Promise<T> {
  const response = await api.delete(endpoint);
  if (response.status != 200) {
    throw new Error(response.data);
  }
  return response.data;
}

export { api, login, logout, setAuthTokens, get, post, put, del };
