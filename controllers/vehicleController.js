import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";

/**
 * Calculate estimated ride duration hours using simplified formula:
 * Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24
 */
const calcDurationHours = (fromPincode, toPincode) => {
  const a = parseInt(fromPincode || "0", 10);
  const b = parseInt(toPincode || "0", 10);
  return Math.abs(a - b) % 24;
};
// add vehicle
export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || capacityKg == null || tyres == null) {
      return res.status(400).json({ message: "name, capacityKg and tyres are required" });
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/vehicles/available
 * Query params:
 *  - capacityRequired
 *  - fromPincode
 *  - toPincode
 *  - startTime (ISO)
 * 
 */
// availbe vehicle
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res
        .status(400)
        .json({ message: "capacityRequired, fromPincode, toPincode and startTime are required" });
    }

    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid startTime" });
    }

    const duration = calcDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // Find vehicles satisfying capacity
    const vehicles = await Vehicle.find({
      capacityKg: { $gte: Number(capacityRequired) },
    });

    const available = [];
    for (const v of vehicles) {
      const conflict = await Booking.findOne({
        vehicleId: v._id,
        isCancelled: false,
        // overlap test: existing.start < requestedEnd && existing.end > requestedStart
        startTime: { $lt: end },
        endTime: { $gt: start },
      });

      if (!conflict) {
        available.push({
          ...v.toObject(),
          estimatedRideDurationHours: duration,
        });
      }
    }

    // 🚩 Handle no available vehicles
    if (available.length === 0) {
      return res.status(200).json({
        message: "No vehicles available for the given criteria.",
        vehicles: [],
      });
    }

    res.status(200).json(available);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

