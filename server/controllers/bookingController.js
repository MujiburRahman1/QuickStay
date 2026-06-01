import Booking from "../models/Booking.js"



// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room })=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate},
        })
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res)=>{
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailabe = await checkAvailability({ checkInDate, checkOutDate, room})
        res.json({ success: true, isAvailabe })
    } catch (error) {
       res.json({ success: false, message: error.message }) 
    }
}

// API to create a new booking
// POST /api/bookings/book

export const creatBooking = async (req, res) =>{
    try {
        // Before Booking Check Availability
        
    } catch (error) {
        
    }
}