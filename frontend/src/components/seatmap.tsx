import { api } from "../utils/api";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface SeatMapData {
  seats: string[][];
}
declare global {
  interface Window {
    Razorpay: any;
  }
}
const SeatMap: React.FC = () => {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get("venueId");
  const hasFetched = useRef(false);

  const selectionData = JSON.parse(
    localStorage.getItem("venueSelection") || "{}"
  );
  const selectedDates: string[] = selectionData.selectedDates || [];
  const selectedTimes: number[] = selectionData.selectedTimes || [];
  const navigate = useNavigate();
  const [seatMap, setSeatMap] = useState<SeatMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [openRazorpay, setOpenRazorpay] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isBlurring, setIsBlurring] = useState(false);

  // Fetch seatmap data
  useEffect(() => {
    if (!venueId || selectedDates.length === 0 || hasFetched.current) return;

    hasFetched.current = true;

    api
      .post("/get_seatmap", { venueId, selectedDates })
      .then((response) => {
        setSeatMap(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching seatmap:", error);
        setLoading(false);
      });
  }, [venueId, selectedDates]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const isSeatAvailable = (seatIndex: number) => {
    return selectedDates.every((_, dateIdx) =>
      selectedTimes.every(
        (timeSlot) =>
          seatMap[dateIdx]?.seats?.[timeSlot]?.[seatIndex] === "free"
      )
    );
  };

  const handleSeatSelection = (seatIndex: number) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatIndex)
        ? prevSeats.filter((seat) => seat !== seatIndex)
        : [...prevSeats, seatIndex]
    );
  };

  const handlePaymentSuccess = () => {
    setIsBlurring(true); // Apply blur

    Swal.fire({
      title: "Booking Confirmed!",
      text: `Your parking slot is successfully booked. You will receive OTPs on your registered email: ${userEmail}`,
      icon: "success",
      confirmButtonText: "OK",
      backdrop: "rgba(0,0,0,0.4)", // Dark overlay
    }).then(() => {
      setIsBlurring(false); // Remove blur when the user clicks OK
      navigate("/home"); // Redirect after closing alert
    });

    api
      .post("/book_seat", {
        venueId,
        selectedDates,
        selectedTimes,
        selectedSeats,
        email: userEmail,
      })
      .catch((error) => {
        console.error("Error booking seats:", error);
      });

    setOpenRazorpay(false);
  };

  const totalAmount =
    selectedDates.length * selectedTimes.length * selectedSeats.length * 100;

  useEffect(() => {
    if (!openRazorpay || totalAmount <= 0) return;

    setIsBlurring(true); // Apply blur before payment opens

    const options = {
      key: "rzp_test_raxyaoALaCjvBM",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Smart Parking System",
      description: "For testing purposes",
      prefill: { name: localStorage.getItem("userName") },
      notes: { address: "IIT Mandi" },
      theme: { color: "#3399cc" },
      handler: function (response: any) {
        console.log("Payment Successful!", response);
        setIsBlurring(false); // Remove blur after payment success
        handlePaymentSuccess();
      },
      modal: {
        escape: false,
        ondismiss: function () {
          setIsBlurring(false);
          navigate("/home"); // Redirect to home page if payment is dismissed
          // window.history.go(-2);
          // console.log("Payment dismissed!");
          // console.log("Current history state:", window.history.state);
          // console.log("Current history length:", window.history.length);

          // // Remove extra history entries
          // if (window.history.length > 2) {
          //   window.history.go(-2);
          // } else {
          //   navigate(`/seatmap?venueId=${venueId}`, { replace: true });
          // }
        },
      },
    };

    const pay = new window.Razorpay(options);
    pay.open();
    setOpenRazorpay(false);
  }, [totalAmount, openRazorpay, userEmail]);

  if (loading)
    return <p className="text-center text-lg">Loading seat map...</p>;
  if (!seatMap.length)
    return <p className="text-center text-lg">No seat data available.</p>;

  return (
    <div
      className={`${
        isBlurring ? "blur-md" : ""
      } flex flex-col items-center gap-6 p-6 bg-gray-200 dark:bg-[#0D1117] dark:bg-gradient-to-tr dark:from-[#0D1117] dark:via-[#0D1117] dark:to-red-900`}
    >
      <h1 className="text-3xl font-bold font-aldrich dark:text-white">
        Parking Map
      </h1>

      <div className="flex flex-col md:flex-row w-full justify-between items-center sm:gap-10 ">
        <div className="flex-grow rounded-lg border-4 p-4 bg-white dark:bg-[#141414]">
          <div className="grid grid-cols-2 sm:grid-cols-10 gap-2 lg:pl-6 xl:pl-6">
            {Array.from({ length: 20 }).map((_, seatIndex) => (
              <button
                key={seatIndex}
                className={`sm:w-12 sm:h-32 sm:my-3 lg:py-20 lg:my-8 lg:px-8 xl:px-10 w-32 h-12 rounded-lg text-lg flex items-center justify-center ${
                  isSeatAvailable(seatIndex)
                    ? selectedSeats.includes(seatIndex)
                      ? "bg-red-400 text-white border font-bold border-red-400 shadow-[inset_0_0_5px_3px_rgba(255,0,0,0.6)]"
                      : "bg-white text-black-400 font-bold hover:bg-red-400 hover:text-white border border-red-400 shadow-[inset_0_0_5px_3px_rgba(255,0,0,0.6)]"
                    : "bg-gray-300 dark:bg-gray-400 cursor-not-allowed text-black font-bold"
                } 
    `} // Inner shadow gradient effect
                disabled={!isSeatAvailable(seatIndex)}
                onClick={() => handleSeatSelection(seatIndex)}
              >
                {seatIndex + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="flex flex-col items-center gap-4 mt-6 md:mt-0">
          <p className="text-xl font-semibold font-domine dark:text-white">
            Total Amount: ₹{totalAmount}
          </p>

          <button
            className={`w-24 h-12 rounded-full shadow-white/50 font-audiowide focus:outline-none ${
              totalAmount === 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-red-700 text-white hover:shadow-lg cursor-pointer"
            }`}
            onClick={() => setOpenRazorpay(true)}
            disabled={totalAmount === 0}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
