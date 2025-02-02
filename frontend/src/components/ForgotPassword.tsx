import { ForgotIcon } from "../icons/Auth";
import { api } from "../utils/api";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "./LoginContext";
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const [formData, setFormData] = useState<{ email: string }>({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { email } = formData;
  const { login, user } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from ?? { pathname: "/home", search: "" };
  useEffect(() => {
    if (user) {
      navigate(from.pathname + from.search);
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.post(`/auth/forgot`, { email });
      if (res.status === 200) {
        setIsSubmitting(false);
        navigate("/update", { state: { email: formData.email } });
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        Swal.fire({
          title: "Error",
          text: "User does not exist. Please sign up",
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
    <div className=" flex w-full flex-col items-center bg-gray-200 dark:bg-[#121212] dark:bg-gradient-to-tr dark:from-[#121212] dark:via-[#121212] dark:to-red-900 p-4 sm:p-12">
      <div className="flex gap-8 max-sm:w-full items-center justify-between rounded-lg bg-[#FFFEF9] shadow-xl dark:bg-[#19141459]/35 p-4 sm:p-8">
        <div className="h-[50vh] lg:h-[70vh] max-md:hidden">
          <ForgotIcon />
        </div>
        <div className="flex grow flex-col items-center gap-3 max-sm:text-sm">
          <p className="text-2xl sm:text-4xl dark:text-[#FAFAFA]">
            Forgot password?
          </p>
          <p className="mb-4 text-lg dark:text-[#FAFAFA] sm:text-xl">
            Enter email to receive OTP
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-4 text-sm sm:text-lg items-center"
          >
            <label className="flex flex-col gap-2 dark:text-[#FAFAFA] rounded-2xl w-full">
              <span>Email</span>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-xl dark:text-gray-300 bg-[#ADADAD]/15 py-2 px-4"
                placeholder="Enter your email"
                required
                value={email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </label>
            <button
              className="bg-gradient-to-r text-white from-[#B01010] to-[#CB2727] dark:to-[#4A0707] rounded-xl w-fi py-2 px-6 sm:px-8 sm:py-3"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting ..." : "Submit"}
            </button>
          </form>
          <span className="text-center dark:text-[#FAFAFA]">
            Remembered the password?
            <Link className="ml-1 text-[#BD0F0F]" to="/login">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
