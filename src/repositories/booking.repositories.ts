import { Prisma } from "@prisma/client"
import prisma_client from "../config/prisma_client.ts"

export const booking = async (bookingInput:Prisma.BookingCreateInput) => {
    const booking = await prisma_client.booking.create({
         data:bookingInput
    })
    return booking
}

