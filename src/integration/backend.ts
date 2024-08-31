import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { backendRoutes } from "../constants";

const baseURL: string = import.meta.env.VITE_BASE_URL || "http://localhost:8000/";

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse): Promise<AxiosResponse> => {
    return response;
  },
  async (error: AxiosError): Promise<never> => {
    if (error.response?.status === 401) {
      //logout user
    }
    return Promise.reject(error);
  }
);

interface BackendRequestParams {
  path: (typeof backendRoutes)[keyof typeof backendRoutes]|string;
  data?: Record<string, any>;
  queryParams?: Record<string, any>;
  headers?: {
    [key: string]: any;
  };
  config?: Omit<AxiosRequestConfig, "url" | "data" | "headers">;
}

export const BackendGet = async <T = any>({
  path,
  headers = {},
  queryParams = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(path, {
      headers,
      params: queryParams, // Add queryParams here
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch from ${path}:`, error);
    throw error;
  }
};

export const BackendPost = async <T = any>({
  path,
  data,
  headers = {},
  queryParams = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(path, data, {
      headers,
      params: queryParams, // Add queryParams here
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to post to ${path}:`, error);
    throw error;
  }
};

export const BackendDelete = async <T = any>({
  path,
  data,
  headers = {},
  queryParams = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.delete<T>(path, {
      headers,
      data,
      params: queryParams, // Add queryParams here
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete from ${path}:`, error);
    throw error;
  }
};

export const BackendPut = async <T = any>({
  path,
  data,
  headers = {},
  queryParams = {},
  config = {},
}: BackendRequestParams): Promise<T> => {
  try {
    const response = await axiosInstance.put<T>(path, data, {
      headers,
      params: queryParams, // Add queryParams here
      ...config,
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to put to ${path}:`, error);
    throw error;
  }
};
