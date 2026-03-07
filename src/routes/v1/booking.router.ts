import { Router } from "express";
import { validate } from "../../middlewares/zod.middleware.ts";
import { bookingValidatorSchema } from "../../validators/validator.ts";
import { confirmBookingController, createBookingController } from "../../controllers/booking.controller.ts";

const bookingRouter = Router()

bookingRouter.route('/').post( validate(bookingValidatorSchema), createBookingController)
bookingRouter.route('/confirm/:idempotencyKey').get(confirmBookingController)

export default bookingRouter