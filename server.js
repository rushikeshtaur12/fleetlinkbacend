import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import manageBookingRoutes from "./routes/manageBookings.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// basic root
app.get("/", (req, res) => res.send("FleetLink API running"));

// routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/manage-bookings", manageBookingRoutes);

// connect to mongo and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/fleetlink";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default app; // exported for tests
