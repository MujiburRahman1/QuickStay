import express from "express";
import { checkAvailabilityAPI } from "../controllers/bookingController.js";


const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect)