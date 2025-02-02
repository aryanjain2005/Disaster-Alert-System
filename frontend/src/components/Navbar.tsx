import { DarkIcon, LightIcon, LoginIcon, LogoutIcon } from "@icons/nav";
import { useLogin } from "./LoginContext";
import DarkModeToggle from "@utils/DarkModeToggle";
import { Link } from "react-router-dom";
import logol from "@/assets/logospslight.png";
import logod from "@/assets/logospsdark.png";

const Navbar = () => {
  const { loggedIn, logout, user } = useLogin();
  console.log("User details:", user);
  // Helper function to extract the first name from the full name or return "aru" if no name is available
  const getDisplayName = (fullName: string | undefined): string => {
    if (!fullName) return "aru"; // Return "aru" if no name is found
    const parts = fullName.split(" ");
    return parts[0];
  };

  return (
    <nav className=" z-20 flex w-full items-center justify-between bg-[#FFFEF9] dark:bg-[#141414] px-4 py-3 sticky top-0">
      {/* Logo (Left) */}
      <Link to="/" className="flex items-center gap-2">
        <img
          className="h-14 -mb-2 -mt-1 w-auto block dark:hidden"
          src={logol}
          alt="Venues"
        />
        <img
          className="h-14 -mb-2 -mt-1 w-auto hidden dark:block"
          src={logod}
          alt="Venues"
        />
      </Link>

      {/* Centered Title */}
      <p
        className="absolute left-1/2 transform -translate-x-1/2 font-bn font-bold text-red-600 
               text-lg sm:text-xl md:text-2xl lg:text-3xl"
      >
        Smart Parking System
      </p>

      {/* Buttons (Right) */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            if (document.body.classList.contains("dark")) {
              document.body.classList.remove("dark");
              document.body.style.backgroundColor = "grey-400";
              localStorage.setItem("theme", "light");
            } else {
              document.body.classList.add("dark");
              document.body.style.backgroundColor = "grey-800";
              localStorage.setItem("theme", "dark");
            }
          }}
          className="p-2 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800"
        >
          <div className="hidden dark:block">
            <DarkIcon />
          </div>
          <div className="block dark:hidden">
            <LightIcon />
          </div>
        </button>

        {/* Login/Logout */}
        {loggedIn ? (
          <>
            <p className="hidden rounded-md bg-red-600 px-4 py-1.5 font-semibold text-white sm:block">
              Welcome {getDisplayName(localStorage.getItem("userName") ?? "")}
            </p>
            <div
              className="p-1 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800"
              onClick={logout}
            >
              <LogoutIcon />
            </div>
          </>
        ) : (
          <Link
            className="p-1 rounded-lg text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800"
            to="/login"
          >
            <LoginIcon />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
