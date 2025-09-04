import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";

// Add new vehicle
export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields required" });
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres, booked: false , createdAt: new Date(),});
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available vehicles
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const requestedStart = new Date(startTime);

    // Ride duration
    let duration = Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    if (duration === 0) duration = 1;
    const requestedEnd = new Date(requestedStart.getTime() + duration * 60 * 60 * 1000);

    // Vehicles with enough capacity
    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired }, booked: false });

    const availableVehicles = [];

    for (const vehicle of vehicles) {
      // Check overlapping bookings
      const overlapping = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: requestedEnd }, endTime: { $gt: requestedStart } },
        ],
      });

      if (!overlapping) {
        availableVehicles.push({ ...vehicle.toObject(), estimatedRideDurationHours: duration, booked: false });
      }
    }

    res.status(200).json(availableVehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
