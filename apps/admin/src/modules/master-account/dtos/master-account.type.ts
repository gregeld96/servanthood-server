import z from "zod";
import { MasterAccountFilterSchema } from "./master-account.schema";

export type GetAccountListType = z.infer<typeof MasterAccountFilterSchema>;