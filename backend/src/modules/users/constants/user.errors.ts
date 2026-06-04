import { HttpStatus } from '@nestjs/common';

export const UserError = {
  NOT_FOUND: {
    code: 'USER.NOT_FOUND',
    message: 'Không tìm thấy người dùng hệ thống',
    statusCode: HttpStatus.NOT_FOUND,
  },
} as const;
