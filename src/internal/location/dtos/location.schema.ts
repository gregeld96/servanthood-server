
import { z } from "zod";
import { generatePaginationSchema } from "src/shared/libs/general/generate";
import { GenerateZodType } from "src/shared/libs/general/validation_type";
import { createZodDto } from "nestjs-zod";
import { LocationFilterSort } from "./location.enum";

export const FormLocationSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    address: GenerateZodType.trimmedString('address'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    latitude: GenerateZodType.trimmedStringOptional('latitude').nullable(),
    longitude: GenerateZodType.trimmedStringOptional('longitude').nullable(),
    linkMap: GenerateZodType.trimmedStringOptional('linkMap').nullable(),
});
export class FormLocationDTO extends createZodDto(FormLocationSchema) {}

export const LocationFilterSchema =
    generatePaginationSchema({
        sortByEnum: LocationFilterSort,
        defaultSort: LocationFilterSort.CREATED_AT_DESC,
    }).extend({
        name: GenerateZodType.trimmedStringOptional('name'),
    })

export class GetLocationListDTO extends createZodDto(LocationFilterSchema) {}