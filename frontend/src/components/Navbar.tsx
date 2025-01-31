import { DarkIcon, LightIcon, LoginIcon, LogoutIcon } from "@icons/nav";
import { useLogin } from "./LoginContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { loggedIn, logout, user } = useLogin();

  // Helper function to extract the first name from the full name
  const getDisplayName = (fullName: string | undefined): string => {
    if (!fullName) return "";
    const parts = fullName.split(" ");
    return parts[0];
  };

  return (
    <nav className="relative top-0 z-20 flex w-full items-center justify-between bg-[#FFFEF9] dark:bg-[#141414] px-4 py-3 md:sticky">
      <Link to="/" className="flex items-center gap-2">
        <img
          className="h-12 w-auto block dark:hidden"
          src="/images/logo.png"
          alt="Venues"
        />
        <img
          className="h-12 w-auto hidden dark:block"
          src="/images/logo-dark.png"
          alt="Venues"
        />
        <p className="font-bn text-[30px] font-bold text-red-600">
          Smart Parking System
        </p>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (document.body.classList.contains("dark")) {
              document.body.classList.remove("dark");
              localStorage.setItem("theme", "light");
            } else {
              document.body.classList.add("dark");
              localStorage.setItem("theme", "dark");
            }
          }}
        >
          <div className="hidden dark:block p-2 rounded-lg hover:bg-zinc-800">
            <DarkIcon />
          </div>
          <div className="block dark:hidden p-2 -mb-0.5 rounded-lg hover:bg-gray-200">
            <LightIcon />
          </div>
        </button>
        {loggedIn ? (
          <>
            <p className="hidden rounded-md bg-red-600 px-4 py-1.5 font-semibold text-white sm:block">
              Welcome {getDisplayName(user?.name)}
            </p>
            <div
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800"
              onClick={logout}
            >
              <LogoutIcon />
            </div>
          </>
        ) : (
          <Link
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800"
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
