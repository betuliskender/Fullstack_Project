import axios, { AxiosInstance, AxiosResponse } from "axios";

// Udvid AxiosRequestConfig til at inkludere 'retry' og 'retryDelay'
declare module "axios" {
  export interface AxiosRequestConfig {
    retry?: number;       // Antal retries
    retryDelay?: number;  // Forsinkelse mellem retries (i ms)
  }
}

// Basis konfiguration for Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Timeout efter 5 sekunder
});

// Retry-logic for axios
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // Succesfuldt response
  async (error) => {
    const config = error.config;

    // Hvis 'retry' ikke er konfigureret, afbryd
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;

    if (config.__retryCount >= config.retry) {
      console.error("Request failed after retries:", error.message);
      return Promise.reject(error);
    }

    // Øg retry-count
    config.__retryCount += 1;

    // Forsinkelse før retry
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(config.retryDelay || Math.pow(2, config.__retryCount) * 1000);

    console.warn(`Retry attempt #${config.__retryCount}`);
    return axiosInstance(config);
  }
);

export default axiosInstance;
