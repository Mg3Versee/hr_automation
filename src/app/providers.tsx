"use client";

import { Provider } from "react-redux";
import { store } from "@/services/redux/store";
import Navbar from "@/components/navbar/Navbar";
import { AuthProvider } from "@/services/context/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <AuthProvider>
    <Navbar />
    {children}
    </AuthProvider>
    </Provider>;
}
