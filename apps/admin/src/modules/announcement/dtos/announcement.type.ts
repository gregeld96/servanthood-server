import z from "zod";
import { FormProjectAnnouncementSchema, ProjectAnnouncementFilterSchema } from "./announcement.schema";

export type FormProjectAnnouncementType = z.infer<typeof FormProjectAnnouncementSchema>;
export type GetProjectAnnouncementListType = z.infer<typeof ProjectAnnouncementFilterSchema>;