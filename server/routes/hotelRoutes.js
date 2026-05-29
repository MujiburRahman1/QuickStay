import express from "express"
import { registerHotel } from "../controllers/hotelController"
import { protect } from "../middleware/authMiddleware"

const hotelRouter = express.Router()

hotelRouter.post('/', protect, registerHotel);



export default hotelRouter;