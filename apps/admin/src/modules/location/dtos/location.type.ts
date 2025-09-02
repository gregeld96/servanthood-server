import z from "zod";
import { LocationFilterSchema, FormLocationSchema } from "./location.schema";

export type FormLocationType = z.infer<typeof FormLocationSchema>;
export type GetLocationListType = z.infer<typeof LocationFilterSchema>;