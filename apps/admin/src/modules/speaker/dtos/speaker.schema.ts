
import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import { SpeakerFilterSort } from "./speaker.enum";
import { GenerateZodType } from "libs/common/src/decorators/validation.dto";
import { FilterSchema } from "libs/common/src/decorators/common.dto";

export const FormSpeakerSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    photo: GenerateZodType.trimmedStringOptional('photo').nullable(),
    title: GenerateZodType.trimmedStringOptional('title').nullable(),
    origin: GenerateZodType.trimmedStringOptional('origin').nullable(),
});
export class FormSpeakerDTO extends createZodDto(FormSpeakerSchema) { }

export const SpeakerFilterSchema = FilterSchema(
    SpeakerFilterSort,
    SpeakerFilterSort.CREATED_AT_DESC,
).extend({
    name: GenerateZodType.trimmedStringOptional('name'),
})

export class GetSpeakerListDTO extends createZodDto(SpeakerFilterSchema) { }