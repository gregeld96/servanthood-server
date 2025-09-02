import { EnumLike, z } from 'zod';

export class GenerateZodType {
    static trimmedString(propertyName: string) {
        return z
            .string({ message: `${propertyName} is required to be string` })
            .min(1, { message: `${propertyName} cannot be empty` })
            .transform((value: string) => value.trim())
    }

    static trimmedStringOptional(propertyName: string) {
        return z
            .string({ invalid_type_error: `${propertyName} should be string` })
            .transform((value: string) => value.trim())
            .optional()
    }

    static arrayOfStringUnique(propertyName: string) {
        return z.array(
            z.string({ message: `${propertyName} should be array of string` }).transform((value: string) => value.trim()),
            { message: `${propertyName} should be array of string` }
        )
            .nonempty(`${propertyName} should not be empty`)
            .refine((data: any) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static arrayOfStringUniqueOptional(propertyName: string) {
        return z.array(
            z.string({ message: `${propertyName} should be array of string` }).transform((value) => value.trim()),
            { message: `${propertyName} should be array of string` }
        )
            .refine((data) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static arrayOfNumberUnique(propertyName: string) {
        return z.array(
            z.number({ message: `${propertyName} should be array of number` }),
            { message: `${propertyName} should be array of number` }
        )
            .nonempty(`${propertyName} should not be empty`)
            .refine((data) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static arrayOfNumberUniqueOptional(propertyName: string) {
        return z.array(
            z.number({ message: `${propertyName} should be array of number` }),
            { message: `${propertyName} should be array of number` }
        )
            .refine((data) => {
                return new Set(data).size === data.length;
            }, {
                message: `${propertyName} elements must be unique`,
            });
    }

    static enumerate(enumObject: EnumLike) {
        return z.nativeEnum(enumObject, { message: `Invalid enum value. Expected ${Object.values(enumObject).join(' | ')}` })
    }

    static date(propertyName: string) {
        return z.string({ message: `${propertyName} is required` }).date(`${propertyName} must be YYYY-MM-DD format`)
    }

    static boolean(propertyName: string) {
        return z.boolean({ message: `${propertyName} should be boolean` })
    }
}