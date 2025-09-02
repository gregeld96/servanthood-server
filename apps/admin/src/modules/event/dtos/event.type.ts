import z from "zod";
import { FormEventSchema, EventFilterSchema } from "./event.schema";

export type FormEventType = z.infer<typeof FormEventSchema>;
export type GetEventListType = z.infer<typeof EventFilterSchema>;