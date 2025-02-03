import { Link } from "react-router-dom";

interface Venue {
  _id: string;
  poster: string;
  title: string;
  genre: string;
  free: boolean;
}

interface VenueCardProps {
  venue: Venue;
  small?: boolean;
  navigate?: boolean;
  children?: React.ReactNode;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  small = true,
  navigate = false,
  children,
}) => {
  // Define the link URL for navigation
  const venueLink = `/venue?venueId=${venue._id}`;

  return (
    <>
      {navigate ? (
        <Link
          to={venueLink}
          className="flex h-full w-full max-h-[400px] flex-col justify-start gap-2 rounded-xl bg-white dark:bg-[#0C0C0C] shadow-lg dark:shadow-white/30"
        >
          <img
            className="w-full grow rounded-t-xl object-cover min-h-[100px] max-h-[200px] sm:max-h-[300px]"
            src={venue.poster}
            alt={venue.title}
          />
          <div
            style={{
              maxHeight: small ? "120px" : "auto",
            }}
            className="flex flex-col overflow-hidden p-4"
          >
            <p className="font-bn font-domine text-xl font-semibold max-sm:text-lg sm:text-2xl text-black dark:text-white">
              {venue.title}
            </p>
            <p className="sm:text-md text-[16px] font-krushna text-black dark:text-white">
              {venue.genre}
            </p>
            {children}
          </div>
        </Link>
      ) : (
        <div className="flex h-full w-full max-h-[400px] flex-col justify-start gap-2 rounded-xl bg-white dark:bg-[#0C0C0C] shadow-lg dark:shadow-white/30 ">
          <img
            className="w-full grow rounded-t-xl object-cover min-h-[100px] max-h-[200px] sm:max-h-[300px]"
            src={venue.poster}
            alt={venue.title}
          />
          <div
            style={{
              maxHeight: small ? "120px" : "auto",
            }}
            className="flex flex-col overflow-hidden p-4"
          >
            <p className="font-bn font-domine text-xl font-semibold max-sm:text-lg sm:text-2xl text-black dark:text-white">
              {venue.title}
            </p>
            <p className="sm:text-md text-[16px] font-krushna text-black dark:text-white">
              {venue.genre}
            </p>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default VenueCard;
