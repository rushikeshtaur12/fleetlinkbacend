import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { calculateRideDuration } from "../utils/rideDuration.js";

// Book a Vehicle
export const bookVehicle = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !customerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const duration = calculateRideDuration(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
      vehicleId,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
    });
    if (conflict) {
      return res.status(409).json({ message: "Vehicle is already booked for this time slot" });
    }

    const booking = await Booking.create({
      vehicleId,
      customerId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
