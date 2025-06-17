import { createZodDto } from 'nestjs-zod'
import { GenerateZodType } from 'src/shared/libs/general/validation_type'
import { z } from 'zod'

const CredentialsSchema = z.object({
    email: GenerateZodType.trimmedString('email'),
    password: GenerateZodType.trimmedString('password'),
})

export class CredentialsDto extends createZodDto(CredentialsSchema) {}