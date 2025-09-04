import express from "express";
import { getAllBookings, cancelBooking } from "../controllers/manageBookingController.js";

const router = express.Router();

router.get("/", getAllBookings);          // GET /api/manage-bookings
router.patch("/:id/cancel", cancelBooking);    // DELETE /api/manage-bookings/:id

export default router;
