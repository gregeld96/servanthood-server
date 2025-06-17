import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { ZodValidationException } from 'nestjs-zod';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // Determine HTTP status code
        const status = exception?.error?.status ? exception?.error?.status 
                        : exception?.error?.code ? exception?.error?.code 
                            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Get error response (handle both string and object cases)
        const errorResponse = exception.error instanceof ZodValidationException ? exception.error?.response?.errors[0].message 
                                : exception.error?.message ? exception.error?.message
                                    : 'Internal Server Error';

        // Ensure the message is always an object with a message field
        const message = errorResponse || 'An error occurred';

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            data: null,
        });
    }
}
