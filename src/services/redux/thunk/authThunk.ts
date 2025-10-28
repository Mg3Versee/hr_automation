import axiosInstance from "@/services/api/axiosConfig";

// LOGIN
export const loginAPI = async (email: string, password: string) => {
  const response = await axiosInstance.post("/login", { email, password });
  return response.data;
};

// SIGNUP
export const signupAPI = async (first_name: string, last_name: string, email: string, password: string) => {
  const response = await axiosInstance.post("/signup", {
    first_name,
    last_name,
    email,
    password,
  });
  return response.data;
};

// SEND OTP
export const sendOTPAPI = async (email: string) => {
  const response = await axiosInstance.post("/send-otp", { email });
  return response.data;
};

// VERIFY OTP
export const verifyOTPAPI = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
  return response.data;
};

// RESET PASSWORD
export const resetPasswordAPI = async (email: string, password: string, reset_token: string) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    email,
    password,
    reset_token,
  });
  return response.data;
};
