import axiosInstance from "@/services/api/axiosConfig";

// LOGIN
export const loginAPI = async (email: string, password: string) => {
  const response = await axiosInstance.post("/api/login", { email, password });
  return response.data;
};
export const signupAPI = async (first_name: string, last_name: string, email: string, password: string) => {
  const response = await axiosInstance.post("/api/register", {
    first_name, last_name, email, password,
  });
  return response.data;
};
// SEND OTP
export const sendOTPAPI = async (email: string) => {
  const response = await axiosInstance.post("/auth/send-otp", { email });
  return response.data;
};
export async function forgotPasswordAPI(email: string, resend = false) {
  const { data } = await axiosInstance.post("/api/forgot-password", { email, resend });
  return data as { success: boolean; message: string; fallback_enabled?: boolean; dev_otp?: string };
}
// VERIFY OTP
export const verifyOTPAPI = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/api/verify-otp", { email, otp });
  return response.data;
};

// RESET PASSWORD
export const resetPasswordAPI = async (email: string, password: string, reset_token: string) => {
  const response = await axiosInstance.post("/api/reset-password", {
    email,
    password,
    reset_token,
  });
  return response.data;
};
