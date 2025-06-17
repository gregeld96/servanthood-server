
import { z } from "zod";
import { generatePaginationSchema } from "src/shared/libs/general/generate";
import { GenerateZodType } from "src/shared/libs/general/validation_type";
import { createZodDto } from "nestjs-zod";
import { SpeakerFilterSort } from "./speaker.enum";

export const FormSpeakerSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    photo: GenerateZodType.trimmedStringOptional('photo').nullable(),
    title: GenerateZodType.trimmedStringOptional('title').nullable(),
    origin: GenerateZodType.trimmedStringOptional('origin').nullable(),
});
export class FormSpeakerDTO extends createZodDto(FormSpeakerSchema) {}

export const SpeakerFilterSchema =
    generatePaginationSchema({
        sortByEnum: SpeakerFilterSort,
        defaultSort: SpeakerFilterSort.CREATED_AT_DESC,
    }).extend({
        name: GenerateZodType.trimmedStringOptional('name'),
    })

export class GetSpeakerListDTO extends createZodDto(SpeakerFilterSchema) {}