import { useState } from "react";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const copyright = String.fromCodePoint(0x00a9);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  return (
    <div className="relative z-10 flex justify-center bg-[#FFFEF9] dark:bg-[#141414] p-4 font-monts">
      <div className="w-4/5 max-sm:w-[90%]">
        <p className="flex items-center gap-1 border-b-2 py-4 font-bn text-3xl font-bold text-[#FB2A25] sm:text-4xl">
          SMART PARKING
        </p>
        <div className="mb-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="my-4 flex flex-col gap-1 dark:text-white">
            <span className="mb-2 text-lg font-semibold capitalize sm:text-2xl">
              contact us
            </span>
            <div className="flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <span className="flex-grow text-sm sm:text-lg text-ellipsis whitespace-nowrap w-[200px]">
                B22092@students.iitmandi.ac.in
              </span>
            </div>
            <div className="flex gap-2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <span>+91-9799000999</span>
            </div>
          </div>

          <div className="my-4 flex flex-col gap-1 sm:pl-16 dark:text-white">
            <span className="text-md mb-2 text-lg font-semibold capitalize sm:text-2xl">
              Legal
            </span>
            <div className="text-md capitalize sm:text-xl">
              <button onClick={openModal}>Privacy Policy</button>
              {isModalOpen && (
                <div>
                  <div
                    className="fixed inset-0 bg-black/50 z-[1000]"
                    onClick={closeModal}
                  ></div>
                  <div className="DialogContent rounded-sm shadow-xl fixed top-[50%] left-[50%] w-[90vw] max-w-[800px] max-h-[85vh] p-6 bg-white dark:bg-[#141414] z-[1001] dark:text-white overflow-y-auto">
                    <h2 className="DialogTitle">Our Privacy Policy</h2>
                    <div className="flex flex-col gap-6">
                      <p className=" text-lg font-bold">Rules and Regulation</p>
                      <div className="flex flex-col gap-4">
                        <p>
                          <span className="mr-2 font-semibold">
                            1. Respectful Behavior:
                          </span>
                          All the customers must behave respectfully with the
                          staff.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            2. No rash driving:
                          </span>
                          Rash driving inside the Parking Zone is strictly
                          prohibited.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            3. Departure Time:
                          </span>
                          Users must leave the parking spot before there
                          designated departure time, else they will be charged
                          extra.
                        </p>
                        <p>
                          <span className="mr-2 font-semibold">
                            5. No Smoking Zone:
                          </span>
                          Smoking is strictly prohibited inside the parking
                          zone.
                        </p>
                      </div>
                    </div>
                    <button
                      className="bg-red-600 py-2 px-4 rounded-lg text-white mt-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-md capitalize sm:text-xl">cookie settings</div>
            <div className="text-md capitalize sm:text-xl">contracts</div>
          </div>
          <div className="my-4 flex flex-col gap-1 dark:text-white">
            <span className="mb-2 text-lg font-semibold capitalize sm:text-2xl">
              connect with us
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                className="text-gray-500 hover:text-[#0866ff] dark:text-gray-400 dark:hover:"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="https://facebook.com">
                <span className="text-md capitalize hover:text-[#0866ff] sm:text-xl">
                  Facebook
                </span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                className="text-gray-500 hover:text-[#d62976] dark:text-gray-400 dark:hover:"
              >
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.758.06-1.192.06-1.777.23-2.326.417-.91.255-1.689.633-2.409 1.353-.72.72-1.098 1.5-1.353 2.409-.187.549-.357 1.134-.417 2.326-.048.974-.06 1.302-.06 3.758v.46c0 2.456.012 2.784.06 3.758.06 1.192.23 1.777.417 2.326.255.91.633 1.689 1.353 2.409.72.72 1.5 1.098 2.409 1.353.549.187 1.134.357 2.326.417 1.012.048 1.302.06 3.758.06h.468c2.456 0 2.784-.012 3.758-.06 1.192-.06 1.777-.23 2.326-.417.91-.255 1.689-.633 2.409-1.353.72-.72 1.098-1.5 1.353-2.409.187-.549.357-1.134.417-2.326.048-.974.06-1.302.06-3.758v-.46c0-2.456-.012-2.784-.06-3.758-.06-1.192-.23-1.777-.417-2.326-.255-.91-.633-1.689-1.353-2.409-.72-.72-1.5-1.098-2.409-1.353-.549-.187-1.134-.357-2.326-.417-1.012-.049-1.302-.06-3.758-.06z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="https://instagram.com">
                <span className="text-md capitalize hover:text-[#d62976] sm:text-xl">
                  Instagram
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex justify-between border-t-2 pt-2 max-sm:flex-col">
          <p>All rights reserved. </p>
          <p>{copyright} Aryan Jain 2025</p>
        </div>
      </div>
    </div>
  );
}
