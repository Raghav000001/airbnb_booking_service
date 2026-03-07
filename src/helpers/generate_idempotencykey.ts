
import {v4 as uuid} from "uuid"

export  function generateIdempotencykey():string {
     return uuid()
}