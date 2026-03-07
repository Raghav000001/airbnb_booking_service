import type { CreateBookingDto } from "../dto/booking.dto.ts";
import { generateIdempotencykey } from "../helpers/generate_idempotencykey.ts";
import { confirmBookingStatus, createBooking, createIdemPotencyKey, finalizeIdempotencyKey, getIdemPotencyKey } from "../repositories/booking.repositories.ts";
import { badRequest, notFound } from "../errors/app.errors.ts";


//1. create booking service
    //take input (createHotelDto) => call the create booking method => pass it the input => generate idempotencykey => create idempotency key => return bookingId, idempotencykey
    
    export const createBookingService = async (bookingData: CreateBookingDto) => {
         const booking =  await createBooking({
              userId:bookingData.userId,
              hotelId:bookingData.hotelId,
              bookingAmount:bookingData.bookingAmount,
              totalGuest:bookingData.totalGuest
          })

          const idempotencyKey = await generateIdempotencykey()
  
          await createIdemPotencyKey(idempotencyKey,booking.id)

          return {
            bookingId:booking.id,
            idempotencyKey
          } 
    
    }
    
//2. finalize booking service
//  getIdempotencykey data => if not throw error => if this data already finalized throw error =>  confirm booking => finalize idempotencykey => return the booking instance

 export const confirmBookingService = async (idempotencyKey:string) => {
    const idempotencyKeyData = await getIdemPotencyKey(idempotencyKey)
    if(!idempotencyKeyData){
        throw new notFound("Idempotency key not found")
    }
    if(idempotencyKeyData.finalized){
        throw new badRequest("Idempotency key already finalized")
    }
    // here payment logic/method should be implemented which i'll implement later
    const booking = await confirmBookingStatus(idempotencyKeyData.bookingId)
    await finalizeIdempotencyKey(idempotencyKey)
    return booking
 }
