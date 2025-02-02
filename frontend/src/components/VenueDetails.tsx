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
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();

    // Function to get the ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (day: number): string => {
      if (day >= 11 && day <= 13) {
        return "th"; // Special case for 11th, 12th, 13th
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const ordinalDay = day;
    const weekday = date.toLocaleString("en-GB", { weekday: "short" });

    // Return an object with weekday, ordinalDay, and month
    return {
      weekday,
      ordinalDay,
      month,
    };
  };

  const formatTime = (hour: number) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(0);

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const [numeric, ampm] = timeString.split(" "); // Split into numeric and AM/PM
    return { numeric, ampm };
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
            <div className="flex flex-wrap gap-2">
              {getUpcomingDates().map((date) => (
                <button
                  key={date}
                  className={`p-5 font-medium rounded-lg max-w-14 sm:max-w-20 sm:max-h-20 max-h-14 ${
                    selectedDates.includes(date)
                      ? "bg-red-400 text-white"
                      : "text-black hover:text-red-400"
                  } flex flex-col items-center justify-center`}
                  onClick={() => handleDateSelection(date)}
                >
                  <span className="text-xs sm:text-sm">
                    {formatDate(date).weekday}
                  </span>
                  <span className="text-base sm:text-lg">
                    {formatDate(date).ordinalDay}
                  </span>
                  <span className="text-xs sm:text-sm">
                    {formatDate(date).month}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Select Time Slots:</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <button
                  key={i}
                  className={`p-1 sm:py-3 relative rounded-lg max-w-14 sm:max-w-20 max-h-14 ${
                    selectedTimes.includes(i)
                      ? "bg-red-400 text-white"
                      : "text-black hover:text-red-400"
                  } flex justify-center items-center sm:text-sm md:text-base text-[11px] overflow-hidden whitespace-nowrap`}
                  onClick={() => handleTimeSelection(i)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold">
                      {formatTime(i).numeric}
                    </span>
                    <span className="text-xs">{formatTime(i).ampm}</span>
                  </div>
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
