import { Filter } from "apps/admin/src/modules/master-account/dtos/master-account.schema";
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

export function buildPrismaCondition(filter: Filter): Record<string, any> {
    const path = filter.key.split("."); // support nested keys (e.g. "member.name")

    let condition: any;

    switch (filter.operator) {
        case "eq":
            condition = { equals: filter.value };
            break;
        case "ne":
            condition = { not: filter.value };
            break;
        case "gt":
            condition = { gt: filter.value };
            break;
        case "gte":
            condition = { gte: filter.value };
            break;
        case "lt":
            condition = { lt: filter.value };
            break;
        case "lte":
            condition = { lte: filter.value };
            break;
        case "like":
            condition = { contains: filter.value };
            break;
        case "ilike":
            condition = { contains: filter.value, mode: "insensitive" };
            break;
        case "in":
            condition = { in: filter.value };
            break;
        case "nin":
            condition = { notIn: filter.value };
            break;
        case "between":
            condition = { gte: filter.value[0], lte: filter.value[1] };
            break;
        case "exists":
            condition = filter.value ? { not: null } : { equals: null };
            break;
        case "isnull":
            condition = filter.value ? { equals: null } : { not: null };
            break;
        default:
            throw ({ code: 400, message: 'Wrong Operator' });
    }

    // Build nested object: e.g. member.name → { member: { name: condition } }
    return path.reduceRight((acc, curr) => ({ [curr]: acc }), condition);
}

export function buildWhereOption(filters: Filter[], useOr = false) {
    if (!filters || filters.length === 0) {
        return {}; // ambil semua
    }

    return {
        [useOr ? "OR" : "AND"]: filters.map(buildPrismaCondition),
    };
}