import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityKg: { type: Number, required: true },
  tyres: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Vehicle", vehicleSchema);
