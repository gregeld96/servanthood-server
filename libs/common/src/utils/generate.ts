import { ErrorName } from "../constants/values";

export const formatToSlug = (name: string): string => {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Ensure no consecutive hyphens
};


export const generatePagination = (page: number, limit: number, totalCount: number) => {
    const take = Number(limit) || 25;
    const skip = Number((Number(page) - 1) * take) || 0;

    const totalPage = Math.ceil(totalCount / limit) || 1;

    if (Number(page) > totalPage) {
        throw { 
            code: 400,
            message: ErrorName.MAXIMUM_PAGE,
        }
    }

    return {
        take,
        skip,
        totalPage,
    }
}