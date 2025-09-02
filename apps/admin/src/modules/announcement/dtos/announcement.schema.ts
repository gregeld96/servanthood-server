
import { z } from "zod";
import { AnnouncementFilterSort } from "./announcement.enum";
import { createZodDto } from "nestjs-zod";
import { FilterSchema } from "libs/common/src/decorators/common.dto";
import { GenerateZodType } from "libs/common/src/decorators/validation.dto";

export const FormProjectAnnouncementSchema = z.object({
    name: GenerateZodType.trimmedString('name'),
    category: GenerateZodType.trimmedString('category'),
    description: GenerateZodType.trimmedStringOptional('description').nullable(),
    urlLink: GenerateZodType.trimmedStringOptional('urlLink').nullable(),
    banner: GenerateZodType.trimmedStringOptional('banner').nullable(),
    isInternal: GenerateZodType.boolean('isInternal'),
});
export class FormProjectAnnouncementDTO extends createZodDto(FormProjectAnnouncementSchema) { }

export const ProjectAnnouncementFilterSchema = FilterSchema(
    AnnouncementFilterSort,
    AnnouncementFilterSort.CREATED_AT_DESC
).extend({
    name: GenerateZodType.trimmedStringOptional('name'),
    category: GenerateZodType.trimmedStringOptional('category'),
})

export class GetProjectAnnouncementListDTO extends createZodDto(ProjectAnnouncementFilterSchema) { }