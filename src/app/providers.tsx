"use client";

import { Provider } from "react-redux";
import { store } from "@/services/redux/store";
import Navbar from "@/components/navbar/Navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <Navbar />
    {children}
    </Provider>;
}
