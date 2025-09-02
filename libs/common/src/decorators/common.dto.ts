import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export enum GeneralFilterSort {
    CREATED_AT = 'createdAt',
    CREATED_AT_DESC = '-createdAt',
}

export const FilterSchema = (sortByEnum: z.EnumLike = GeneralFilterSort, defaultSort?: string) => z.object({
    keyword: z.string().optional(),
    page: z.string().min(1).optional()
        .transform((val) => parseInt(val || '1', 10))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Page must be a positive integer' }),
    limit: z.string().min(1).optional()
        .transform((val) => parseInt(val || '25', 10))
        .refine((val) => !isNaN(val) && val > 0, { message: 'Limit must be a positive integer' }),
    sortBy: z.nativeEnum(sortByEnum, { message: `Invalid enum value. Expected ${Object.values(sortByEnum).join(' | ')}` })
        .optional()
        .default(defaultSort || '-createdAt')
        .transform((val) => val.toString()),
});

export class FilterDto extends createZodDto(FilterSchema()) { }