import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Hero = () => {
  const { navigate, getToken, axios, setSearchedCities, user } = useAppContext();
  const [destination, setDestination] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();

    const searchCity = destination.trim();
    if (!searchCity) {
      toast.error("Please enter a destination");
      return;
    }

    navigate(`/rooms?destination=${encodeURIComponent(searchCity)}`);
    scrollTo(0, 0);

    if (!user) return;

    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.post(
        "/api/user/store-recent-search",
        { recentSearchedCity: searchCity },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setSearchedCities((prevSearchedCities) => {
          const updated = [...prevSearchedCities, searchCity];
          if (updated.length > 3) updated.shift();
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to save recent search:", error.message);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-start justify-center px-4 py-28 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center sm:px-6 md:px-16 lg:px-24 xl:px-32'>
      <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20">
        The Ultimate Hotel Experience
      </p>
      <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4">
        Discover Your Perfect Gateway Destination
      </h1>
      <p className="max-w-2xl mt-2 text-sm md:text-base">
        Unparalleled luxury and comfort await at the world's most exclusive
        hotels and resorts. Start your journey today.
      </p>

      <form
        onSubmit={onSearch}
        className="bg-white text-gray-500 rounded-lg px-4 py-4 mt-8 flex w-full max-w-5xl flex-col gap-4 shadow-lg sm:px-6 md:flex-row md:items-end"
      >
        <div className="w-full md:flex-1">
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input
            onChange={(e) => setDestination(e.target.value)}
            value={destination}
            list="destinations"
            id="destinationInput"
            type="text"
            className="w-full rounded border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            required
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="w-full rounded border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none"
          />
        </div>

        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="w-full rounded border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none"
          />
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto md:flex-col md:items-start">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={4}
            id="guests"
            type="number"
            className="w-24 rounded border border-gray-200 px-3 py-2 mt-1.5 text-sm outline-none md:w-20"
            placeholder="0"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white cursor-pointer md:my-auto max-md:w-full"
        >
          <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
