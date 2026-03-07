import { Prisma } from "@prisma/client";
import prisma_client from "../config/prisma_client.ts";

export const createBooking = async (bookingInput: Prisma.BookingCreateInput) => {
  const booking = await prisma_client.booking.create({
    data: bookingInput,
  });
  return booking;
};

export const createIdemPotencyKey = async (key: string, bookingId: number) => {
  const idempotencyKey = await prisma_client.idempotencyKey.create({
    data: {
      key,
      booking: {
        connect: {
          id: bookingId,
        },
      },
    },
  });

  return idempotencyKey;
};

export const getIdemPotencyKey = async (key: string) => {
  const idempotencyKey = await prisma_client.idempotencyKey.findUnique({
    where: {
      key,
    },
  });

  return idempotencyKey;
};

export const getBookingById = async (bookingId: number) => {
  const booking = await prisma_client.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return booking;
};

export const confirmBookingStatus = async (bookingId: number) => {
  const booking = await prisma_client.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status:"CONFIRMED",
    },
  });
  
  return booking;
};

export const cancelBooking = async (bookingId: number) => {
  const booking = await prisma_client.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });

  return booking;
};


export const finalizeIdempotencyKey = async (key:string) => {
    const idempotencyKey = await prisma_client.idempotencyKey.update({
        where:{
            key
        },
        data:{
           finalized:true
        }
     })
     return idempotencyKey
}
