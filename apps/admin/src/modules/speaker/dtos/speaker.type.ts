import z from "zod";
import { FormSpeakerSchema, SpeakerFilterSchema } from "./speaker.schema";

export type FormSpeakerType = z.infer<typeof FormSpeakerSchema>;
export type GetSpeakerListType = z.infer<typeof SpeakerFilterSchema>;