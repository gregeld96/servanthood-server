import { z } from "zod";
import { generatePaginationSchema } from "src/shared/libs/general/generate";
import { GenerateZodType } from "src/shared/libs/general/validation_type";
import { createZodDto } from "nestjs-zod";
import { ParticipantFilterSort } from "./participant.enum";

export const UpdateStatusParticipantSchema = z.object({
    status: GenerateZodType.trimmedString('name'),
});

export class UpdateStatusParticipantDTO extends createZodDto(UpdateStatusParticipantSchema) { }

export const ParticipantFilterSchema =
    generatePaginationSchema({
        sortByEnum: ParticipantFilterSort,
        defaultSort: ParticipantFilterSort.NAME,
    }).extend({
        name: GenerateZodType.trimmedStringOptional('name'),
    })

export class GetParticipantListDTO extends createZodDto(ParticipantFilterSchema) { }


export const FormEventParticipantSchema = z.object({
    participantName: GenerateZodType.trimmedString('participantName'),
    eventId: GenerateZodType.trimmedString('eventId'),
    participantDob: GenerateZodType.trimmedStringOptional('participantDob').nullable(),
    participantGender: GenerateZodType.trimmedStringOptional('participantGender').nullable(),
    participantParishOrigin: GenerateZodType.trimmedStringOptional('participantParishOrigin').nullable(),
    memberId: GenerateZodType.trimmedStringOptional('memberId').nullable(),
});
export class FormEventParticipantDTO extends createZodDto(FormEventParticipantSchema) {}