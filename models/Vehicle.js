import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityKg: { type: Number, required: true },
  tyres: { type: Number, required: true },
  booked: { type: Boolean, default: false }, // key to track booking status
  createdAt: { type: Date, default: Date.now }, // ← make sure this exists

});

export default mongoose.model("Vehicle", vehicleSchema);
