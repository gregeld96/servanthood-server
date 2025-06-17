import { HttpException, HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}

throw new HttpException(
  {
    success: false,
    message: 'User not found',
    errorCode: 'USER_NOT_FOUND',
  },
  HttpStatus.NOT_FOUND,
);