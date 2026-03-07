import {z} from "zod";

export const bookingValidatorSchema = z.object({
     userId:z.number({message:'user id must be present'}),
     hotelId:z.number({message:'hotel id must be present'}),
     bookingAmount:z.number({message:"booking amount must be present"}).min(1,{message:"booking amount must be present"}),
     totalGuest:z.number({message:"total guest must be present"}).min(1,{message:"at least 1 guest is required"})
})
