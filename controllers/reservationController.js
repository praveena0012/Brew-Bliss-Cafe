import Reservation from "../models/Reservation.js";

// Add a reservation
export const addReservation = async (req, res) => {
    try {
        const { name, email, phone, guests, date, time, occasion, notes, status } = req.body;

        // Check for existing reservation at the same date and time
        const existingReservation = await Reservation.findOne({
            date: new Date(date),
            time: time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingReservation) {
            return res.status(400).json({
                message: "A reservation already exists for this date and time",
                error: "Time slot unavailable"
            });
        }

        const newReservation = new Reservation({
            name, 
            email, 
            phone, 
            guests, 
            date: new Date(date), 
            time, 
            occasion, 
            notes, 
            status: status || 'pending'
        });

        await newReservation.save();
        res.status(201).json({
            message: "Reservation created successfully",
            reservation: newReservation
        });
    } catch (error) {
        console.error("Error adding reservation:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({
            message: "Error adding reservation",
            error: error.message
        });
    }
};

// Get all reservations
export const getAllReservations = async (req, res) => {
    try {
        const { status, date, page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        // Filter by status if provided
        if (status) {
            query.status = status;
        }
        
        // Filter by date if provided
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.date = { $gte: startDate, $lt: endDate };
        }

        const reservations = await Reservation.find(query)
            .sort({ date: 1, time: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Reservation.countDocuments(query);

        res.status(200).json({
            reservations,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({
            message: "Error fetching reservations",
            error: error.message
        });
    }
};

// Get reservation by ID
export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const reservation = await Reservation.findById(id);
        
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        res.status(200).json({
            reservation
        });
    } catch (error) {
        console.error("Error fetching reservation:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid reservation ID"
            });
        }
        res.status(500).json({
            message: "Error fetching reservation",
            error: error.message
        });
    }
};

// Update reservation
export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // If updating date/time, check for conflicts
        if (updateData.date || updateData.time) {
            const existingReservation = await Reservation.findOne({
                _id: { $ne: id },
                date: new Date(updateData.date || req.body.date),
                time: updateData.time || req.body.time,
                status: { $in: ['pending', 'confirmed'] }
            });

            if (existingReservation) {
                return res.status(400).json({
                    message: "A reservation already exists for this date and time",
                    error: "Time slot unavailable"
                });
            }
        }

        const reservation = await Reservation.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        res.status(200).json({
            message: "Reservation updated successfully",
            reservation
        });
    } catch (error) {
        console.error("Error updating reservation:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid reservation ID"
            });
        }
        res.status(500).json({
            message: "Error updating reservation",
            error: error.message
        });
    }
};

// Delete reservation
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        
        const reservation = await Reservation.findByIdAndDelete(id);
        
        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        res.status(200).json({
            message: "Reservation deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: "Invalid reservation ID"
            });
        }
        res.status(500).json({
            message: "Error deleting reservation",
            error: error.message
        });
    }
};

// Get reservations by phone number
export const getReservationsByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        
        const reservations = await Reservation.find({ phone })
            .sort({ date: 1, time: 1 });

        res.status(200).json({
            reservations,
            count: reservations.length
        });
    } catch (error) {
        console.error("Error fetching reservations by phone:", error);
        res.status(500).json({
            message: "Error fetching reservations",
            error: error.message
        });
    }
};