import { z } from 'zod';
import ErrorCategory from 'src/shared/constants/error';

export const generatePaginationSchema = (payload: {sortByEnum: z.EnumLike, defaultSort: string}) => {
  const {sortByEnum, defaultSort} = payload;
  
  return z.object({
      limit: z.coerce.number({ message: 'limit should be number' }).min(1).optional().default(10),
      currentPage: z.coerce.number({ message: 'currentPage should be number' }).min(1).optional().default(1),
      sortBy: z.nativeEnum(sortByEnum, { message: `Invalid enum value. Expected ${Object.values(sortByEnum).join(' | ')}` })
                .optional()
                .default(defaultSort)
                .transform((val) => val.toString()),
  })
}

export const generatePaginationValue = (payload: { limit: number, currentPage: number, totalCount: number }) => {
  const { limit, currentPage, totalCount } = payload;

  const totalPage = Math.ceil(totalCount / limit) || 1;

  if (currentPage > totalPage) {
    throw { 
      name: ErrorCategory.ErrorName.MAXIMUM_PAGE,
      maxPage: totalPage,
    }
  }

  return {
    take: limit,
    skip: (currentPage - 1) * limit,
    totalPage,
  }
}

export const formatToSlug = (name: string): string => {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Ensure no consecutive hyphens
};