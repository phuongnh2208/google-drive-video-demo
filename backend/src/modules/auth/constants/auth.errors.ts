import { HttpStatus } from '@nestjs/common';

export const AuthError = {
  INVALID_TOKEN: {
    code: 'AUTH.INVALID_TOKEN',
    message: 'Token Google không hợp lệ hoặc đã hết hạn',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  MISSING_EMAIL: {
    code: 'AUTH.MISSING_EMAIL',
    message: 'Token không chứa thông tin email',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  UNAUTHORIZED: {
    code: 'AUTH.UNAUTHORIZED',
    message: 'Bạn chưa đăng nhập',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  EMAIL_NOT_ALLOWED: {
    code: 'AUTH.EMAIL_NOT_ALLOWED',
    message: 'Email của bạn chưa được đăng ký trong hệ thống',
    statusCode: HttpStatus.FORBIDDEN,
  },
  WRONG_VIDEO_CLASS: {
    code: 'AUTH.WRONG_VIDEO_CLASS',
    message: 'Bạn không thuộc lớp được phép xem video này',
    statusCode: HttpStatus.FORBIDDEN,
  },
} as const;
