import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { EventFilterSort } from "./event.enum";
import { GenerateZodType } from "libs/common/src/decorators/validation.dto";
import { FilterSchema } from "libs/common/src/decorators/common.dto";

export const FormEventSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    category: GenerateZodType.trimmedString('category'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    horizontalBanner: GenerateZodType.trimmedStringOptional('horizontalBanner').nullable(),
    verticalBanner: GenerateZodType.trimmedStringOptional('verticalBanner').nullable(),
    locationId: GenerateZodType.trimmedString('locationId'),
    startDate: GenerateZodType.trimmedString('startDate'),
    endDate: GenerateZodType.trimmedString('endDate'),
    startTime: GenerateZodType.trimmedStringOptional('startTime').nullable(),
    endTime: GenerateZodType.trimmedStringOptional('endTime').nullable(),
    openRegis: GenerateZodType.trimmedStringOptional('openRegis').nullable(),
    closeRegis: GenerateZodType.trimmedStringOptional('closeRegis').nullable(),
    isInternal: GenerateZodType.boolean('isInternal'),
    maxParticipant: GenerateZodType.trimmedStringOptional('maxParticipant').nullable(),
    speakers: GenerateZodType.arrayOfNumberUnique('speakers'),
});
export class FormEventDTO extends createZodDto(FormEventSchema) { }

export const EventFilterSchema = FilterSchema(
    EventFilterSort,
    EventFilterSort.CREATED_AT_DESC,
).extend({
    name: GenerateZodType.trimmedStringOptional('name'),
    startFrom: GenerateZodType.trimmedStringOptional('startFrom'),
    startTo: GenerateZodType.trimmedStringOptional('startTo'),
})

export class GetEventListDTO extends createZodDto(EventFilterSchema) { }