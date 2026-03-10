import { Prisma } from "@prisma/client";
import prisma_client from "../config/prisma_client.ts";
import { validate as validateKey } from "uuid";
import { badRequest , notFound } from "../errors/app.errors.ts";
import type { IdempotencyKey } from "@prisma/client";

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

export const getIdemPotencyKeyWithLock = async (txn:Prisma.TransactionClient,key: string) => {
       if (!validateKey(key)) {
           throw new badRequest("Invalid idempotency key")
       }

      const idempotencyKey: Array<IdempotencyKey> = await txn.$queryRaw(
    Prisma.sql`SELECT * FROM \`IdempotencyKey\` WHERE \`key\` = ${key} FOR UPDATE`
)

     
      if (!idempotencyKey || idempotencyKey.length === 0) {
        throw new notFound("Idempotency key not found")
      }
      
      return idempotencyKey[0]
};

export const getBookingById = async (bookingId: number) => {
  const booking = await prisma_client.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  return booking;
};

export const confirmBookingStatus = async (txn:Prisma.TransactionClient,bookingId: number) => {
  const booking = await txn.booking.update({
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


export const finalizeIdempotencyKey = async (txn:Prisma.TransactionClient,key:string) => {
    const idempotencyKey = await txn.idempotencyKey.update({
        where:{
            key
        },
        data:{
           finalized:true
        }
     })
     return idempotencyKey
}
