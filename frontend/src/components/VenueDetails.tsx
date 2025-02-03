import { api } from "../utils/api";
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
      .get<Venue>("/venuebyID", { params: { venueId } })
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const ordinalDay = day;
    const weekday = date.toLocaleString("en-GB", { weekday: "short" });

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

  const handleDateSelection = (date: string) => {
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

    localStorage.setItem("venueSelection", JSON.stringify(selectionData));
    navigate(`/seatmap?venueId=${venueId}`);
  };

  // Disable button when no date or time is selected
  const isSubmitDisabled =
    selectedDates.length === 0 || selectedTimes.length === 0;

  if (!venue) return <p className="text-center text-lg">Loading venue...</p>;

  return (
    <div className="flex flex-col w-full p-6 bg-gray-200 dark:bg-[#0D1117] dark:bg-gradient-to-tr dark:from-[#0D1117] dark:via-[#0D1117] dark:to-red-900">
      <div className="flex w-full justify-between items-start gap-10">
        {/* Venue Details */}
        <div className="flex flex-col gap-4 lg:ml-5">
          <img
            src={venue.poster}
            alt={venue.title}
            className="grow rounded-xl object-cover min-h-[100px] max-h-[200px] sm:max-h-[300px] md:max-h-[360px] w-full bg-white border-4 border-red-700 dark:bg-[#0C0C0C] shadow-2xl dark:shadow-white/40"
          />
          <h1 className="text-3xl font-koh text-center dark:text-white font-bold">
            {venue.title}
          </h1>
          <p className="text-lg -mt-3 font-audiowide text-center text-gray-600 dark:text-gray-200">
            {venue.genre}
          </p>

          {/* Submit Button (small screens) */}
          <div className="sm:hidden mt-6 text-center">
            <button
              className={`w-24 h-12 rounded-full shadow-white/50 font-audiowide cursor-pointer focus:outline-none ${
                isSubmitDisabled
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-red-700 text-white hover:shadow-lg"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              Submit
            </button>
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="flex flex-col gap-6 dark:text-white">
          {/* Date selection */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-kanit font-semibold">
              Select Dates:
            </label>
            <div className="flex flex-wrap gap-2">
              {getUpcomingDates().map((date) => (
                <button
                  key={date}
                  className={`p-5 dark:text-white font-medium rounded-lg max-w-14 sm:max-w-20 sm:max-h-20 max-h-14 ${
                    selectedDates.includes(date)
                      ? "bg-red-400 text-white"
                      : "text-black hover:text-red-400"
                  } flex flex-col items-center justify-center`}
                  onClick={() => handleDateSelection(date)}
                >
                  <span className="text-xs font-aldrich sm:text-sm">
                    {formatDate(date).weekday}
                  </span>
                  <span className="text-base sm:text-lg">
                    {formatDate(date).ordinalDay}
                  </span>
                  <span className="text-xs font-aldrich sm:text-sm">
                    {formatDate(date).month}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time selection */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold font-kanit">
              Select Time Slots:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2">
              {Array.from({ length: 24 }).map((_, i) => (
                <button
                  key={i}
                  className={`p-1 dark:text-white sm:py-3 relative rounded-lg max-w-14 sm:max-w-20 max-h-14 ${
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
                    <span className="text-xs font-aldrich">
                      {formatTime(i).ampm}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button (large screens) */}
          <div className="hidden sm:block mt-6 text-center">
            <button
              className={`w-24 h-12 rounded-full shadow-white/50 font-audiowide focus:outline-none ${
                isSubmitDisabled
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-red-700 text-white hover:shadow-lg cursor-pointer"
              }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
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
