import { v4 as uuidv4 } from "uuid"

export const createIdempotencyKey = (): string => uuidv4()
