import z from "zod";
import { FormEventSchema, EventFilterSchema, EventParticipantFilterSchema } from "./event.schema";

export type FormEventType = z.infer<typeof FormEventSchema>;
export type GetEventListType = z.infer<typeof EventFilterSchema>;
export type GetEventParticipantType = z.infer<typeof EventParticipantFilterSchema>;