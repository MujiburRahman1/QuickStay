import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const HotelCard = ({ room, index }) => {
  const { currency } = useAppContext();

  if (!room?.hotel) return null;

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      className="relative w-full overflow-hidden rounded-xl bg-white sm:max-w-80
        text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]"
    >
      {room.images?.[0] && (
        <img src={room.images[0]} alt="" className="h-52 w-full object-cover" />
      )}

      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
          Best Seller
        </p>
      )}
      <div className="p-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-playfair text-lg sm:text-xl font-medium text-gray-800">
            {room.hotel.name}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <img src={assets.starIconFilled} alt="star-icon" /> 4.5
          </div>
        </div>
        <div className="flex items-start gap-1 text-sm">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
          <p>
            <span className="text-lg sm:text-xl text-gray-800">
              {currency} {room.pricePerNight}/night
            </span>
          </p>
          <button
            className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 w-full sm:w-auto
                transition-all cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
