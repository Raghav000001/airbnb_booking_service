
// create booking handler
// accept the input => call booking service => return response 
import { internalServerError } from "../errors/app.errors.ts"
import { confirmBookingService, createBookingService } from "../services/booking.service.ts"
import type { Request , Response } from "express"
import type { CreateBookingDto } from "../dto/booking.dto.ts"
import { serverConfig } from "../config/index.ts"
import { redlock } from "../config/redis.config.ts"

// in the create booking i want a lock (redis redlock) on the hotel id
export const createBookingController = async (req:Request,res:Response) => {
    const { hotelId } = req.body as CreateBookingDto
    const resource = `hotel-${hotelId}`
    const TTL = serverConfig.lockTTL
    try {
        await redlock.acquire([resource],TTL)
        const booking = await createBookingService(req.body)
        return res.status(201).json({
            message:"Booking created successfully",
            booking
        })
    } catch (error) {
        throw new internalServerError("failed to acquire lock,try again later")
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
    } catch (error:any) {
        throw new internalServerError(error.message)
    }
}