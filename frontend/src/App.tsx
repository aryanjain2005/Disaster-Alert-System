import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "@components/Login";
import Signup from "@components/Signup";
import GetOTP from "@components/GetOTP";
import UpdatePassword from "@components/UpdatePassword";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/getOTP" element={<GetOTP />} />
        <Route path="/update" element={<UpdatePassword />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
