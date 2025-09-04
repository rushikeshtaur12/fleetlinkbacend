import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityKg: { type: Number, required: true },
  tyres: { type: Number, required: true },
  booked: { type: Boolean, default: false }  // key to track booking status
});

export default mongoose.model("Vehicle", vehicleSchema);
