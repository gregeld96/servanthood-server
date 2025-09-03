import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { GenerateZodType } from "libs/common/src/decorators/validation.dto";
import { FilterSchema } from "libs/common/src/decorators/common.dto";
import { MasterAccountFilterSort } from "./master-account.enum";

/** Allowed field names like: user.name, status, created_at */
const keySchema = z
  .string()
  .min(1, "key is required")
  .regex(/^[A-Za-z0-9_.-]+$/, "key may contain letters, numbers, _, ., -");

/** Common primitive values you might filter on */
const primitive = z.union([z.string(), z.number(), z.boolean(), z.date()]);

/** Helper: array of primitives (non-empty) */
const primitiveArray = z.array(primitive).nonempty("value must not be empty");

/** Helper: 2-tuple for between (numbers, dates, or strings) */
const betweenTuple = z
  .tuple([primitive, primitive])
  .refine(([a, b]) => typeof a === typeof b, {
    message: "between tuple must contain the same types",
  });

/**
 * Discriminated union on "operator"
 * Extend/trim operators as your backend expects.
 */
const filterSchema = z.discriminatedUnion("operator", [
  z.object({
    key: keySchema,
    operator: z.literal("eq"),
    value: primitive,
  }),
  z.object({
    key: keySchema,
    operator: z.literal("ne"),
    value: primitive,
  }),
  z.object({
    key: keySchema,
    operator: z.literal("gt"),
    value: z.union([z.number(), z.date(), z.string()]),
  }),
  z.object({
    key: keySchema,
    operator: z.literal("gte"),
    value: z.union([z.number(), z.date(), z.string()]),
  }),
  z.object({
    key: keySchema,
    operator: z.literal("lt"),
    value: z.union([z.number(), z.date(), z.string()]),
  }),
  z.object({
    key: keySchema,
    operator: z.literal("lte"),
    value: z.union([z.number(), z.date(), z.string()]),
  }),
  z.object({
    key: keySchema,
    operator: z.literal("like"),
    value: z.string().min(1, "value is required"),
  }),
  z.object({
    key: keySchema,
    operator: z.literal("ilike"),
    value: z.string().min(1, "value is required"),
  }),
  z.object({
    key: keySchema,
    operator: z.literal("in"),
    value: primitiveArray,
  }),
  z.object({
    key: keySchema,
    operator: z.literal("nin"),
    value: primitiveArray,
  }),
  z.object({
    key: keySchema,
    operator: z.literal("between"),
    value: betweenTuple,
  }),
  z.object({
    key: keySchema,
    operator: z.literal("exists"),
    value: z.boolean(), // true = field exists, false = not exists
  }),
  z.object({
    key: keySchema,
    operator: z.literal("isnull"),
    value: z.boolean(), // true = is null, false = is not null
  }),
]);


/** Type inference for TS */
export type Filter = z.infer<typeof filterSchema>;

// export const FormEventSchema = z.object({
//     name: GenerateZodType.trimmedString('name'),
//     category: GenerateZodType.trimmedString('category'),
//     description: GenerateZodType.trimmedStringOptional('description').nullable(),
//     horizontalBanner: GenerateZodType.trimmedStringOptional('horizontalBanner').nullable(),
//     verticalBanner: GenerateZodType.trimmedStringOptional('verticalBanner').nullable(),
//     locationId: GenerateZodType.trimmedString('locationId'),
//     startDate: GenerateZodType.trimmedString('startDate'),
//     endDate: GenerateZodType.trimmedString('endDate'),
//     startTime: GenerateZodType.trimmedStringOptional('startTime').nullable(),
//     endTime: GenerateZodType.trimmedStringOptional('endTime').nullable(),
//     openRegis: GenerateZodType.trimmedStringOptional('openRegis').nullable(),
//     closeRegis: GenerateZodType.trimmedStringOptional('closeRegis').nullable(),
//     isInternal: GenerateZodType.boolean('isInternal'),
//     maxParticipant: GenerateZodType.trimmedStringOptional('maxParticipant').nullable(),
//     speakers: GenerateZodType.arrayOfNumberUnique('speakers'),
// });
// export class FormEventDTO extends createZodDto(FormEventSchema) { }

export const MasterAccountFilterSchema = FilterSchema(
    MasterAccountFilterSort,
    MasterAccountFilterSort.CREATED_AT_DESC,
).extend({
    filter: z.array(filterSchema)
})

export class GetAccountListDTO extends createZodDto(MasterAccountFilterSchema) { }