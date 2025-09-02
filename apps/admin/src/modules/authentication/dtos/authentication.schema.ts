import { GenerateZodType } from 'libs/common/src/decorators/validation.dto'
import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CredentialsSchema = z.object({
    email: GenerateZodType.trimmedString('email'),
    password: GenerateZodType.trimmedString('password'),
})

export class CredentialsDto extends createZodDto(CredentialsSchema) {}