import z from "zod";
import { FormEventParticipantSchema, ParticipantFilterSchema, UpdateStatusParticipantSchema } from "./participant.schema";

export type ParticipantUpdateStatusType = z.infer<typeof UpdateStatusParticipantSchema>;
export type GetListParticipantFilterType = z.infer<typeof ParticipantFilterSchema>;
export type FormEventParticipantType = z.infer<typeof FormEventParticipantSchema>;