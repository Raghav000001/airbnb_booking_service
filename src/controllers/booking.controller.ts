
// create booking handler
// accept the input => call booking service => return response 
import { internalServerError } from "../errors/app.errors.ts"
import { confirmBookingService, createBookingService } from "../services/booking.service.ts"
import type { Request , Response } from "express"

export const createBookingController = async (req:Request,res:Response) => {
    try {
        const booking = await createBookingService(req.body)
        return res.status(201).json({
            message:"Booking created successfully",
            booking
        })
    } catch (error) {
        throw new internalServerError("error in booking controller")
    }

}

export const confirmBookingController = async (req:Request,res:Response) => {
    try {
        const {idempotencyKey} = req.params
        const booking = await confirmBookingService(idempotencyKey as string)
           return res.status(201).json({
            message:"Booking confirmed successfully",
            bookingId:booking.id,
            bookingStatus:booking.status
        })
    } catch (error) {
        throw new internalServerError("error in booking controller")
    }
}