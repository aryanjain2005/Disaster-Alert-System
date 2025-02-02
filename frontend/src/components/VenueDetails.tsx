import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

interface Venue {
  _id: string;
  title: string;
  poster: string;
  genre: string;
  free: boolean;
}

const VenueDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get("venueId");
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);

  // Allow multiple dates to be selected
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<number[]>([]);

  useEffect(() => {
    if (!venueId) return;

    api
      .get<Venue>(`/venuebyID`, { params: { venueId } })
      .then((response) => setVenue(response.data))
      .catch((error) => console.error("Error fetching venue:", error));
  }, [venueId]);

  const getUpcomingDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD format
    }
    return dates;
  };

  // Function to format date as "6th Feb, 2025"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (hour: number) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle multiple date selections
  const handleDateSelection = (date: string) => {
    console.log(selectedDates);
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const handleTimeSelection = (hour: number) => {
    setSelectedTimes((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const handleSubmit = () => {
    if (!venueId || selectedDates.length === 0 || selectedTimes.length === 0) {
      alert("Please select at least one date and time slot.");
      return;
    }

    const selectionData = {
      venueId,
      selectedDates,
      selectedTimes,
    };

    // Store in localStorage
    localStorage.setItem("venueSelection", JSON.stringify(selectionData));

    // Navigate to SeatMap page
    navigate(`/seatmap?venueId=${venueId}`);
  };

  if (!venue) return <p className="text-center text-lg">Loading venue...</p>;

  return (
    <div className="flex flex-col w-full p-6">
      <div className="flex w-full justify-between items-start gap-10">
        {/* Venue Details - Sticks to the Left */}
        <div className="flex flex-col gap-4">
          <img
            src={venue.poster}
            alt={venue.title}
            className=" grow rounded-t-xl object-cover min-h-[100px] max-h-[200px] sm:max-h-[300px]"
          />
          <h1 className="text-3xl font-bold">{venue.title}</h1>
          <p className="text-lg text-gray-600">{venue.genre}</p>
          <div className="sm:hidden mt-6 text-center">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Date and Time Selection - Sticks to the Right */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Select Dates:</label>
            <div className="flex flex-wrap gap-2 grid-cols-4 sm:grid-cols-6 md:grid-cols-8">
              {getUpcomingDates().map((date) => (
                <button
                  key={date}
                  className={`p-2 rounded-lg border max-w-14 sm:max-w-20 sm:max-h-20 max-h-14 hover:bg-orange-300 ${
                    selectedDates.includes(date)
                      ? "bg-orange-300 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => handleDateSelection(date)}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Select Time Slots:</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <button
                  key={i}
                  className={`p-1 sm:py-3 relative rounded-lg border max-w-14 sm:max-w-20 max-h-14 hover:bg-orange-300 ${
                    selectedTimes.includes(i)
                      ? "bg-orange-300 text-white"
                      : "bg-gray-200 text-black"
                  } flex justify-center items-center text-sm md:text-base overflow-hidden whitespace-nowrap`}
                  onClick={() => handleTimeSelection(i)}
                >
                  {formatTime(i)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="hidden sm:block mt-6 text-center">
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
