
import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { LocationFilterSort } from "./location.enum";
import { FilterSchema } from "libs/common/src/decorators/common.dto";
import { GenerateZodType } from "libs/common/src/decorators/validation.dto";

export const FormLocationSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    address: GenerateZodType.trimmedString('address'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    latitude: GenerateZodType.trimmedStringOptional('latitude').nullable(),
    longitude: GenerateZodType.trimmedStringOptional('longitude').nullable(),
    linkMap: GenerateZodType.trimmedStringOptional('linkMap').nullable(),
});
export class FormLocationDTO extends createZodDto(FormLocationSchema) { }

export const LocationFilterSchema = FilterSchema(
    LocationFilterSort,
    LocationFilterSort.CREATED_AT_DESC,
).extend({
    name: GenerateZodType.trimmedStringOptional('name'),
})

export class GetLocationListDTO extends createZodDto(LocationFilterSchema) { }