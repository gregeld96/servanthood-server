import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';
import { ApiResponse } from 'src/shared/dtos/type';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => ({
                success: true,
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