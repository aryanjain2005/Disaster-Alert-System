import { HideEye, ShowEye, SignupIcon } from "../icons/Auth";
import { api } from "../utils/api";
import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "./LoginContext";
import { useEffect } from "react";

interface FormData {
  name: string;
  phone: string;
  designation?: string;
  password: string;
  otp: string;
  email: string;
}

const Signup = () => {
  const { login, user } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from ?? { pathname: "/home", search: "" };
  const otpEmail = (location.state?.email as string) ?? "";
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    designation: "",
    password: "",
    otp: "",
    email: otpEmail,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      !/^[a-zA-Z0-9._%+-]+@(iitmandi.ac.in|.*\.iitmandi.ac.in)$/.test(
        formData.email
      )
    ) {
      Swal.fire({
        title: "Error",
        text: "Please enter a valid college email ID.",
        icon: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post(`/auth/signup`, formData);
      if (res.status === 201) {
        navigate("/login", { state: { email: formData.email } });
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: "Email already registered",
        icon: "error",
      });
      console.error("Error occurred:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate(from.pathname + from.search);
    }
  }, [user]);
  return (
    <div className="flex w-full flex-col items-center bg-gray-200 dark:bg-[#121212] dark:bg-gradient-to-tr dark:from-[#121212] dark:via-[#121212] dark:to-red-900 p-4 sm:p-12">
      <div className="flex gap-8 max-sm:w-full items-center justify-between rounded-lg bg-[#FFFEF9] shadow-xl dark:bg-[#19141459]/35 p-4 sm:p-8">
        <div className="h-[50vh] lg:h-[70vh] max-md:hidden">
          <SignupIcon />
        </div>
        <div className="flex grow flex-col items-center gap-3 max-sm:text-sm">
          <p className="text-2xl sm:text-4xl dark:text-white">Sign up</p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4 text-sm sm:text-lg items-center"
          >
            <label className="dark:text-white flex flex-col gap-2 rounded-2xl w-full">
              <span>Name</span>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 py-2 px-4 sm:min-w-[300px]"
              />
            </label>
            <label className="flex flex-col gap-2 rounded-2xl dark:text-white w-full">
              <span>Email</span>
              <input
                type="email"
                name="email"
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 py-2 px-4 sm:min-w-[300px]"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </label>
            <label className="flex flex-col gap-2 dark:text-white rounded-2xl w-full">
              <span>Phone no</span>
              <input
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 py-2 px-4 sm:min-w-[300px]"
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col gap-2 rounded-2xl dark:text-white w-full">
              <span>OTP</span>
              <input
                name="otp"
                required
                value={formData.otp}
                placeholder="OTP"
                onChange={handleChange}
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 py-2 px-4"
              />
            </label>
            <label className="flex flex-col gap-1 rounded-2xl w-full dark:text-white items-end">
              <p className="flex gap-2 w-full">
                <span className="details">Password</span>
                <div
                  className="flex items-center w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ShowEye /> : <HideEye />}
                </div>
              </p>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 py-2 px-4"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            <button
              className="bg-gradient-to-r text-white from-[#B01010] to-[#CB2727] dark:to-[#4A0707] rounded-xl w-fi py-2 px-6 sm:px-8 sm:py-3"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Signup"}
            </button>
          </form>
          <span className="text-center dark:text-white">
            Already have an account?
            <Link className="ml-1 text-[#BD0F0F]" to="/login">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
