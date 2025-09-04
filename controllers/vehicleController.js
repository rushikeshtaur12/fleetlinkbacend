import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import { calculateRideDuration } from "../utils/rideDuration.js";

// Add Vehicle
export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find Available Vehicles
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Missing required query parameters" });
    }

    // Convert startTime to proper ISO string (UTC)
    let start = new Date(startTime);
    const now = new Date();

    // Prevent searching for past times
    if (start < now) start = now;

    const duration = calculateRideDuration(fromPincode, toPincode); // in hours
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // Get vehicles with enough capacity
    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired } });

    const availableVehicles = [];

    for (const vehicle of vehicles) {
      // Check overlapping bookings
      const overlapping = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } },
        ],
      });

      if (!overlapping) {
        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: duration,
        });
      }
    }

    res.status(200).json(availableVehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
