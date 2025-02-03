import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useLogin } from "../components/LoginContext";
import { HideEye, LoginIcon, ShowEye } from "../icons/Auth";
import { api } from "../utils/api";

const Login = () => {
  const { login, user } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from ?? { pathname: "/home", search: "" };

  const signupEmail = location.state?.email;

  const [formData, setFormData] = useState({
    email: signupEmail ?? "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(from.pathname + from.search);
    }
  }, [user]);

  // ✅ Corrected type for handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Corrected type for handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/login`, formData);
      if (res.status === 200) {
        // ✅ Corrected response handling
        const userData = res.data.user_data;
        const loginData = res.data.login_data;

        // Save user email and login
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userPhone", userData.phone);
        login(loginData); // Login with user data (including token)

        Swal.fire({
          title: "Success",
          text: "You are successfully logged in!",
          icon: "success",
        });

        navigate("/home"); // Redirect after login
      } else {
        console.error("Invalid response:", res);
      }
    } catch (err: any) {
      // ✅ Corrected error handling
      if (err?.response?.status) {
        const status = err.response.status;
        const errorMessages: Record<number, string> = {
          400: "Both Email and Password are required",
          401: "Either email or password is wrong",
          404: "User not found",
          500: "Internal server error",
        };

        Swal.fire({
          title: "Error",
          text: errorMessages[status] || "An unexpected error occurred",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center bg-gray-200 dark:bg-[#0D1117] dark:bg-gradient-to-tr dark:from-[#0D1117] dark:via-[#0D1117] dark:to-red-900 p-4 sm:p-12">
      <div className="flex gap-8 max-sm:w-full items-center justify-between rounded-lg bg-[#FFFEF9] shadow-xl dark:bg-[#161B22] dark:bg-opacity-80 p-4 sm:p-8">
        <div className="h-[40vh] lg:h-[60vh] max-md:hidden">
          <LoginIcon />
        </div>
        <div className="flex max-sm:w-full  w-fit  flex-col items-center gap-3 max-sm:text-sm">
          <p className="text-2xl sm:text-4xl font-funnel-display dark:text-white">
            Welcome Again!
          </p>
          <p className="mb-4 text-lg font-funnel-display dark:text-[#FAFAFA] sm:text-xl">
            Please Login to continue
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col  gap-4 text-sm sm:text-lg items-center"
          >
            <label className="flex flex-col gap-2 rounded-2xl font-domine w-full">
              <span className="font-merriweather dark:text-white">Email</span>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 dark:bg-[#F60101]/15 py-2 px-4 sm:min-w-[300px]"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col gap-1.5 font-domine rounded-2xl w-full items-end">
              <p className="flex gap-2 w-full">
                <span className="details font-merriweather dark:text-white">
                  Password
                </span>
                <div
                  className="flex items-center w-8 cursor-pointer bg-transparent dark:bg-[#781111]/85 rounded-xl"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  {showPassword ? <ShowEye /> : <HideEye />}
                </div>
              </p>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 dark:bg-[#F60101]/15 py-2 px-4"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Link className="text-sm font-domine text-[#BD0F0F]" to="/forgot">
                Forgot Password?
              </Link>
            </label>
            <button
              className="bg-gradient-to-r font-audiowide from-[#B01010] to-[#CB2727] dark:to-[#4A0707] text-white rounded-xl w-fi py-2 px-6 sm:px-8 sm:py-3 "
              type="submit"
            >
              Login
            </button>
          </form>
          <span className=" text-center font-domine dark:text-white ">
            Don't have an account?
            <Link className="ml-1 cursor-pointer text-[#BD0F0F]" to="/getOTP">
              Signup
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
