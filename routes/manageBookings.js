import express from "express";
import { getAllBookings, cancelBooking } from "../controllers/manageBookingController.js";

const router = express.Router();

router.get("/", getAllBookings);
router.patch("/:id/cancel", cancelBooking);

export default router;
