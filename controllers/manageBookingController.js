import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

// 1️⃣ Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("vehicleId"); // populate vehicle info
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Cancel booking by ID
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Check if already cancelled
    if (booking.isCancelled) {
      return res.status(400).json({ message: "Booking already cancelled", booking });
    }

    booking.isCancelled = true;
    await booking.save();
    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
