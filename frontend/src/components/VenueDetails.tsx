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
  const [selectedNumber, setSelectedNumber] = useState<number>(1);

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
      selectedNumber,
    };

    // Store in localStorage
    localStorage.setItem("venueSelection", JSON.stringify(selectionData));

    // Navigate to SeatMap page
    navigate(`/seatmap?venueId=${venueId}`);
  };

  if (!venue) return <p className="text-center text-lg">Loading venue...</p>;

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <img src={venue.poster} alt={venue.title} className="w-96 rounded-lg" />
      <h1 className="text-3xl font-bold">{venue.title}</h1>
      <p className="text-lg text-gray-600">{venue.genre}</p>

      {/* Date Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Select Dates:</label>
        <div className="flex gap-2">
          {getUpcomingDates().map((date) => (
            <button
              key={date}
              className={`p-2 rounded-lg border ${
                selectedDates.includes(date)
                  ? "bg-blue-500 text-white"
                  : "bg-red-600 text-green-500"
              }`}
              onClick={() => handleDateSelection(date)}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Select Time Slots:</label>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <button
              key={i}
              className={`p-2 rounded-lg border ${
                selectedTimes.includes(i)
                  ? "bg-blue-500 text-white"
                  : "bg-red-600 text-green-500"
              }`}
              onClick={() => handleTimeSelection(i)}
            >
              {i}:00
            </button>
          ))}
        </div>
      </div>

      {/* Number Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-semibold">Select a Number (1-20):</label>
        <input
          type="number"
          min="1"
          max="20"
          className="border p-2 rounded-lg w-20 text-center"
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(Number(e.target.value))}
        />
      </div>

      {/* Submit Button */}
      <button
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default VenueDetails;
