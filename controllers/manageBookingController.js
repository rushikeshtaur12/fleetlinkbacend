import Booking from "../models/Booking.js";

// getting all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("vehicleId").sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

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
