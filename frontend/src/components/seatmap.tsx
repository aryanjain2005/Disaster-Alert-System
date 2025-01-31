import { api } from "@/utils/api";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface SeatMapData {
  seats: string[][];
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

  const [seatMap, setSeatMap] = useState<SeatMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [openRazorpay, setOpenRazorpay] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

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
    // Retrieve email from localStorage
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const isSeatAvailable = (seatIndex: number) => {
    return selectedDates.every((date, dateIdx) =>
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
    // Prepare the data for the booking API
    const bookingData = {
      venueId: venueId,
      selectedDates: selectedDates,
      selectedTimes: selectedTimes,
      selectedSeats: selectedSeats,
      email: localStorage.getItem("userEmail"),
    };
    console.log(bookingData);
    api
      .post("/book_seat", bookingData)
      .then((response) => {
        console.log("Seats booked successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error booking seats:", error);
      });

    setOpenRazorpay(false);
  };

  const totalAmount =
    selectedDates.length * selectedTimes.length * selectedSeats.length * 100;

  useEffect(() => {
    if (openRazorpay && totalAmount > 0) {
      const options = {
        key: "rzp_test_raxyaoALaCjvBM",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Chalchitra",
        description: "for testing purpose",
        prefill: {
          name: "Aryan",
        },
        notes: {
          address: "Razorpay Corporate office",
        },
        theme: {
          color: "#3399cc",
        },
        handler: function (response: any) {
          console.log("Payment Successful!", response);
          handlePaymentSuccess();
        },
      };

      const pay = new window.Razorpay(options);
      pay.open();
      setOpenRazorpay(false);
    }
  }, [totalAmount, openRazorpay, userEmail]);

  if (loading)
    return <p className="text-center text-lg">Loading seat map...</p>;
  if (!seatMap.length)
    return <p className="text-center text-lg">No seat data available.</p>;

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Seat Map</h1>
      <p className="text-lg text-gray-600">Select your seats</p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }).map((_, seatIndex) => (
          <button
            key={seatIndex}
            className={`w-12 h-12 rounded-lg border ${
              isSeatAvailable(seatIndex)
                ? selectedSeats.includes(seatIndex)
                  ? "bg-green-500 text-white"
                  : "bg-white border-black text-green-600"
                : "bg-gray-400"
            }`}
            disabled={!isSeatAvailable(seatIndex)}
            onClick={() => handleSeatSelection(seatIndex)}
          >
            {seatIndex + 1}
          </button>
        ))}
      </div>

      <p className="text-xl font-semibold">Total Amount: ₹{totalAmount}</p>

      <button
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        onClick={() => setOpenRazorpay(true)}
        disabled={totalAmount === 0}
      >
        Pay Now
      </button>
    </div>
  );
};

export default SeatMap;
