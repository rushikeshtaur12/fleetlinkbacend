import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const start = new Date(startTime);

    // calculate estimated ride duration
    let duration = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    if (duration === 0) duration = 1;

    const end = new Date(start.getTime() + duration * 60 * 60 * 1000); // ✅ calculate endTime

    // check for conflicts
    const conflict = await Booking.findOne({
      vehicleId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ]
    });

    if (conflict) return res.status(409).json({ message: "Vehicle already booked" });

    // create booking with endTime
    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end, // ✅ include endTime
      customerId,
    });

    // mark vehicle as booked
    vehicle.booked = true;
    await vehicle.save();

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
