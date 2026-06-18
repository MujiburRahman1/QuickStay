import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { getToken } from "@clerk/react";

const RoomDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { axios, currency } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check If the Room is Available
  const checkAvailability = async () => {
    try {
      // Check is Check-In-Date is greater than Check-Out-Date
      if(checkInDate >= checkOutDate){
        toast.error('Check-In-Date should be less than Check-Out-Date')
        return;
      }
      const { data } = await axios.post(
        '/api/bookings/check-availability',
        { room: id, checkInDate, checkOutDate },
      );

      if (data.success) {
        const available = data.isAvailable ?? data.isAvailabe;
        if (available) {
          setIsAvailable(true);
          toast.success('Room is available');
        } else {
          setIsAvailable(false);
          toast.error('Room is not available');
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // onSubmitHandler function to check availability & book the room
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if(!isAvailable){
        return checkAvailability();
      }else{
        const { data } = await axios.post('/api/bookings/book', {room: id, checkInDate, checkOutDate, guests, 
          paymentMethod: "Pay At Hotel"
        }, {headers: { Authorization: `Bearer ${await getToken()}`}})
        if (data.success){
          toast.success(data.message);
          navigate('/my-bookings');
          scrollTo(0, 0);
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/rooms/${id}`);
        if (data.success) {
          setRoom(data.room);
          setMainImage(data.room.images?.[0] ?? null);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoom();
  }, [id, axios]);

  if (loading) {
    return (
      <div className="py-28 md:py-35 px-4 text-center text-gray-500">
        Loading room details...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="py-28 md:py-35 px-4 text-center text-gray-500">
        Room not found.
      </div>
    );
  }

  return (
    <div className="py-28 md:py-35 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair">
          {room.hotel?.name}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">200+ reviews</p>
      </div>

      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="location-icon" />
        <span>{room.hotel?.address}</span>
      </div>

      <div className="flex flex-col lg:flex-row mt-6 gap-4 md:gap-6">
        <div className="lg:w-1/2 w-full">
          {mainImage && (
            <img
              src={mainImage}
              alt="Room"
              className="h-72 w-full rounded-xl shadow-lg object-cover sm:h-96 lg:h-full"
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:w-1/2 w-full">
          {room.images?.length > 1 &&
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                key={index}
                src={image}
                alt="Room"
                className={`h-32 w-full rounded-xl shadow-md object-cover cursor-pointer sm:h-44 md:h-52
                    ${mainImage === image && "outline-3 outline-orange-500"}`}
              />
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                {facilityIcons[item] && (
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                )}
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-2xl font-medium">
          {currency} {room.pricePerNight}/night
        </p>
      </div>

      {/* CheckIn CheckOut Form */}
      <form onSubmit={onSubmitHandler}
        className="flex flex-col lg:flex-row items-start lg:items-center 
        justify-between gap-6 bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-4 sm:p-6 rounded-xl mx-auto mt-12 md:mt-16 max-w-6xl"
      >
        <div className="grid w-full grid-cols-1 gap-4 text-gray-500 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:gap-8">
          <div className="flex flex-col">
            <label htmlFor="checkInDate" className="font-medium">
              Check-In
            </label>
            <input
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              type="date"
              id="checkInDate"
              placeholder="Check-In"
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>
          <div className="w-px h-15 bg-gray-300/70 max-lg:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="checkOutDate" className="font-medium">
              Check-Out
            </label>
            <input
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate}
              disabled={!checkInDate}
              type="date"
              id="checkOutDate"
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-lg:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="guests" className="font-medium">
              Guests
            </label>
            <input
              onChange={(e) => setGuests(e.target.value)}
              value={guests}
              type="number"
              id="guests"
              min={1}
              defaultValue={1}
              className="w-full max-w-28 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md
          w-full lg:w-auto lg:px-16 xl:px-25 py-3 md:py-4 text-base cursor-pointer"
        >
          {isAvailable ? "Book Now" : "Check Availability"}
        </button>
      </form>

      <div className="mt-16 md:mt-25 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl border-y border-gray-300 my-12 md:my-15 py-8 md:py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to
          availability. You get a comfortable two-bedroom apartment that has a
          true city feeling.
        </p>
      </div>

      {room.hotel?.owner && (
        <div className="flex flex-col items-start gap-4 mt-10">
          <div className="flex gap-4 items-start">
            <img
              src={room.hotel.owner.image}
              alt="Host"
              className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover shadow-md"
            />
            <div>
              <p className="text-lg md:text-xl font-medium">
                Hosted by {room.hotel.name}
              </p>
              <div className="flex items-center mt-2">
                <StarRating />
                <p className="ml-2 text-sm">200+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact Now
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
