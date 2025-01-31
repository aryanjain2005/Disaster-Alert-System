import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "@components/Login";
import Signup from "@components/Signup";
import GetOTP from "@components/GetOTP";
import UpdatePassword from "@components/UpdatePassword";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import VenueDetails from "./components/VenueDetails";
import SeatMap from "./components/seatmap";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]); // React to changes in `theme`

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} /> {/* Pass as props */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/getOTP" element={<GetOTP />} />
        <Route path="/update" element={<UpdatePassword />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/venue" element={<VenueDetails />} />
        <Route path="/seatmap" element={<SeatMap />} />
      </Routes>
    </>
  );
}

export default App;
