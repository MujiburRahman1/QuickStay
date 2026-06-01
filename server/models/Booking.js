import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:  {type: String, ref: "User", required: true},
    user:  {type: String, ref: "User", required: true},
    user:  {type: String, ref: "User", required: true},
    user:  {type: String, ref: "User", required: true},
    user:  {type: String, ref: "User", required: true},
    user:  {type: String, ref: "User", required: true},
    user:  {type: String, ref: "User", required: true},

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
