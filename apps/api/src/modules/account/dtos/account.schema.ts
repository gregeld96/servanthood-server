import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const UpdateAccountSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    dob: z.string().min(1, 'Date of Birth is required'),
    parishOrigin: z.string().min(1, 'Parish Origin must more than 1 character'),
    gender: z.string().min(1, 'Gender must more than 1 character'),
    nickname: z.string().min(1, 'Gender must more than 1 character'),
    marital: z.string().optional(),
    maritalDate: z.string().optional(),
    phoneNumber: z.string().min(1, 'Phone Number must more than 1 character'),
    partnerName: z.string().optional(),
    socialMediaInstagram: z.string().optional(),
})

export class UpdateAccountDto extends createZodDto(UpdateAccountSchema) { }