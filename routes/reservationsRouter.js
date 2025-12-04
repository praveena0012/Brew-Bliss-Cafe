import express from "express";

import {
    addReservation,
    getAllReservations,
    getReservationById,
    updateReservation,
    deleteReservation,
    getReservationsByPhone
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

// Create a new reservation
reservationRouter.post("/", addReservation);

// Get all reservations with optional filtering and pagination
reservationRouter.get("/", getAllReservations);

// Get reservations by phone number
reservationRouter.get("/phone/:phone", getReservationsByPhone);

// Get a specific reservation by ID
reservationRouter.get("/:id", getReservationById);

// Update a reservation
reservationRouter.put("/:id", updateReservation);

// Delete a reservation
reservationRouter.delete("/:id", deleteReservation);

export default reservationRouter;