import { VerifyIcon } from "../icons/Auth";
import { api } from "../utils/api";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "./LoginContext";
import Swal from "sweetalert2";

export default function GetOTP() {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login, user } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from ?? { pathname: "/home", search: "" };
  useEffect(() => {
    if (user) {
      navigate(from.pathname + from.search);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !/^[a-zA-Z0-9._%+-]+@(iitmandi.ac.in|.*\.iitmandi.ac.in)$/.test(email)
    ) {
      setEmail("");
      Swal.fire({
        title: "Error",
        text: "Invalid email id. Use institute mail id.",
        icon: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/auth/send-otp`, { email });
      if (res.status === 200) {
        navigate("/signup", { state: { email } });
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        Swal.fire({
          title: "Error",
          text: "User already exists. Please log in.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Internal server error",
          icon: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className=" flex w-full flex-col items-center bg-gray-200 dark:bg-gradient-to-tr dark:from-[#121212] dark:via-[#121212] dark:to-red-900 p-4 sm:p-12">
      <div className="flex gap-8 max-sm:w-full items-center justify-between rounded-lg bg-[#FFFEF9] shadow-xl  dark:bg-[#14101059]/35 p-4 sm:p-8">
        <div className="h-[50vh] lg:h-[70vh] max-md:hidden">
          <VerifyIcon />
        </div>
        <div className="flex grow flex-col items-center gap-3 max-sm:text-sm">
          <p className="text-2xl sm:text-4xl dark:text-white">
            Email Verification!
          </p>
          <p className="mb-4 text-lg dark:text-[#FAFAFA] sm:text-xl">
            Please verify Email to continue
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col  gap-4 text-sm sm:text-lg items-center"
          >
            <label className="flex flex-col gap-2 rounded-2xl dark:text-white w-full">
              <span>Email</span>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full dark:text-gray-300 sm:min-w-[300px] rounded-xl bg-[#ADADAD]/15 py-2 px-4"
                placeholder="enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </label>
            <button
              className="bg-gradient-to-r text-white  from-[#B01010] to-[#CB2727] dark:to-[#4A0707]  rounded-xl w-fi py-2 px-6 sm:px-8 sm:py-3 "
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying ..." : "Verify"}
            </button>
          </form>
          <span className=" text-center dark:text-white">
            Already have an account?
            <Link className="ml-1 text-[#BD0F0F]" to="/login">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
