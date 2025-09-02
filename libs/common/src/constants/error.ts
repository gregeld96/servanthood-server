interface CustomError {
    name?: string;
    code?: number;
    status?: number;
    maxPage?: number;
    message?: string;
    meta?: any;
}

export const prismaClientError = (error: CustomError) => {
    if (String(error.code) === 'P2002') {
        return {
            code: 400,
            message: `${error.meta.target[0]} already registered! Used another ${error.meta.target[0]}`,
        }
    } else if (String(error.code) === 'P2025') {
        return {
            code: 404,
            message: `Data not found!`,
        }
    }

    return {
        code: 400,
        message: ``
    }
}

export const prismaNotFound = () => {
    return {
        code: 404,
        message: `Data not found`
    }
}

export const internalServerError = (error: CustomError) => {
    return {
        code: error.code,
        message: error.message,
    }
}