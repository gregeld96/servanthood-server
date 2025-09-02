import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const CredentialSchema = z.object({
    email: z.string().min(1, 'Email is required'),
    password: z.string().min(2, 'Password must more than 1 character'),
})

const CreateAccountSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    dob: z.string().min(1, 'Date of Birth is required'),
    password: z.string().min(2, 'Password must more than 1 character'),
    parishOrigin: z.string().min(1, 'Parish Origin must more than 1 character'),
    gender: z.string().min(1, 'Gender must more than 1 character'),
    nickname: z.string().min(1, 'Gender must more than 1 character'),
    marital: z.string().optional(),
    maritalDate: z.string().optional(),
    phoneNumber: z.string().min(1, 'Phone Number must more than 1 character'),
    partnerName: z.string().optional(),
    socialMediaInstagram: z.string().optional(),
})

export class CredentialDto extends createZodDto(CredentialSchema) { }
export class CreateAccountDto extends createZodDto(CreateAccountSchema) { }