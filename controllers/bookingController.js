import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

/**
 * Simplified duration function (same as vehicleController)
 */
const calcDurationHours = (fromPincode, toPincode) => {
  const a = parseInt(fromPincode || "0", 10);
  const b = parseInt(toPincode || "0", 10);
  return Math.abs(a - b) % 24;
};

const generateCustomerId = () => `CUST-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime } = req.body;
    // basic validation
    if (!vehicleId || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "vehicleId, fromPincode, toPincode and startTime are required" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) return res.status(400).json({ message: "Invalid startTime" });

    const duration = calcDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // Re-check availability to avoid race conditions
    const conflict = await Booking.findOne({
      vehicleId,
      isCancelled: false,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflict) {
      return res.status(409).json({ message: "Vehicle already booked for overlapping time slot" });
    }

    // Generate customerId on backend
    const customerId = generateCustomerId();

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,
      isCancelled: false
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
