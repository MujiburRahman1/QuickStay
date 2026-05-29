

//API to create a new room for a hotel

import Hotel from "../models/Hotel";

export const creatRoom = async (req, res)=>{
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userId})

        if(!hotel) return res.json({ success: false, message: "No Hotel found"})

        
    } catch (error) {
        
    }

}


// API to get all room

export const getRooms = async (req, res)=>{

}

// API to get all rooms for specific hotel
export const getOwnerRooms = async (req, res)=>{

}

// API to toggle availability of a room
export const toggleRoomAvailability = async ( req, res)=>{

}