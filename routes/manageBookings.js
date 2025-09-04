import express from "express";
import { getAllBookings, deleteBooking } from "../controllers/manageBookingController.js";

const router = express.Router();

router.get("/", getAllBookings);          // GET /api/manage-bookings
router.delete("/:id", deleteBooking);     // DELETE /api/manage-bookings/:id

export default router;
