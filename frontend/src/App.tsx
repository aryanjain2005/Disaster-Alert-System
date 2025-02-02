import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Login from "@components/Login";
import Signup from "@components/Signup";
import GetOTP from "@components/GetOTP";
import UpdatePassword from "@components/UpdatePassword";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import VenueDetails from "./components/VenueDetails";
import SeatMap from "./components/seatmap";
import { LoginProvider } from "@/components/LoginContext";
import { NextUIProvider } from "@nextui-org/react";
import ProtectedRoute from "@components/ProtectedRoute";
function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    if (storedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    console.log("Theme changed to", storedTheme);
  }, []);

  return (
    <BrowserRouter>
      <NextUIProvider>
        <LoginProvider>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/getOTP" element={<GetOTP />} />
            <Route path="/update" element={<UpdatePassword />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/venue" element={<VenueDetails />} />
              <Route path="/seatmap" element={<SeatMap />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </LoginProvider>{" "}
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
