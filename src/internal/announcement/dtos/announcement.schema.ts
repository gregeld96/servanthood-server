
import { z } from "zod";
import { generatePaginationSchema } from "src/shared/libs/general/generate";
import { GenerateZodType } from "src/shared/libs/general/validation_type";
import { AnnouncementFilterSort } from "./announcement.enum";
import { createZodDto } from "nestjs-zod";

export const FormProjectAnnouncementSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    category: GenerateZodType.trimmedString('category'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    urlLink: GenerateZodType.trimmedStringOptional('urlLink').nullable(),
    banner: GenerateZodType.trimmedStringOptional('banner').nullable(),
    isInternal: GenerateZodType.boolean('isInternal'),
});
export class FormProjectAnnouncementDTO extends createZodDto(FormProjectAnnouncementSchema) {}

export const ProjectAnnouncementFilterSchema =
    generatePaginationSchema({
        sortByEnum: AnnouncementFilterSort,
        defaultSort: AnnouncementFilterSort.CREATED_AT_DESC,
    }).extend({
        name: GenerateZodType.trimmedStringOptional('name'),
        category: GenerateZodType.trimmedStringOptional('category'),
    })

export class GetProjectAnnouncementListDTO extends createZodDto(ProjectAnnouncementFilterSchema) {}