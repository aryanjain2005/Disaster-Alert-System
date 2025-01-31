import { VerifyIcon } from "@icons/Auth";
import { api } from "@/utils/api";
import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function GetOTP() {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

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
    <div className="flex w-full flex-col items-center p-4">
      <div className="flex gap-8 items-center justify-between p-8 shadow-xl">
        <div className="h-[50vh] lg:h-[70vh] max-md:hidden">
          <VerifyIcon />
        </div>
        <div className="flex grow flex-col items-center gap-3">
          <p className="text-2xl">Email Verification!</p>
          <p className="mb-4 text-lg">Please verify Email to continue</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying ..." : "Verify"}
            </button>
          </form>
          <span>
            Already have an account?
            <Link to="/login"> Sign In</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
