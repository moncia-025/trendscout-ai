import axios, { type AxiosError } from "axios";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  timeout: 300_000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      "Request failed";

    return Promise.reject(new Error(message));
  },
);
