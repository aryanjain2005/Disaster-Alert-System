import VenueCard from "../components/VenueCard";
import { api } from "../utils/api";
import useDeviceSize from "../utils/useDeviceSize";
import { useEffect, useState } from "react";

interface Venue {
  _id: string;
  poster: string;
  title: string;
  genre: string;
  free: boolean;
}

interface GrpCardProps {
  type: string;
  venues: Venue[];
  shouldNav?: boolean;
}

const GrpCard: React.FC<GrpCardProps> = ({
  type,
  venues,
  shouldNav = true,
}) => {
  const [showMore, setShowMore] = useState(false);
  const deviceSize = useDeviceSize();

  const scrollToElement = (elementId: string, additionalOffset = 0) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const elementPosition = element.offsetTop - additionalOffset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  };

  const limit = ["xs", "sm"].includes(deviceSize)
    ? 2
    : ["md", "lg"].includes(deviceSize)
    ? 3
    : 4;

  return (
    <div id={type} className="flex w-4/5 flex-col gap-2 ">
      <div className="flex items-center justify-between w-full gap-2">
        <p className="font-bn font-audiowide font-semibold text-3xl text-[#E40C2B]">
          {type}
        </p>
        {venues.length > limit && (
          <p
            className="w-fit font-bebas-neue cursor-pointer text-center text-lg hover:bg-white dark:hover:bg-zinc-800 dark:text-white pt-2 px-2 rounded-xl"
            onClick={() => {
              setShowMore(!showMore);
              showMore && scrollToElement(type, 120);
            }}
          >
            {showMore ? "Show Less" : "Show More"}
          </p>
        )}
      </div>

      <div className="rounded-xl flex flex-col items-center gap-2 bg-white dark:bg-[#121212] p-4 sm:gap-6 sm:p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {venues.slice(0, showMore ? venues.length : limit).map((venue, i) => (
            <VenueCard venue={venue} key={i} navigate={shouldNav} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    // Specify the type for the response
    api
      .get<Venue[]>("/venue") // <== Here we're specifying the response type explicitly
      .then((response) => {
        setVenues(response.data); // This will now be typed correctly
      })
      .catch((error) => {
        console.error("Error fetching venues:", error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-10 dark:bg-black bg-gray-200">
      {venues.length > 0 && <GrpCard type="Venues" venues={venues} />}
    </div>
  );
};

export default Home;
