import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const MasterFetchSchema = z.object({
    category: z.string(),
    group: z.string(),
});

export class MasterFetchDto extends createZodDto(MasterFetchSchema) {}