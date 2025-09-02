import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from 'libs/common/src/decorators/api.dto';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: response.statusCode,
                message: 'Request successful',
                data,
            })),
            catchError((error) => {
                return throwError(() => ({
                    success: false,
                    message: error.message || 'An error occurred',
                    error,
                }));
            }),
        );
    }
}