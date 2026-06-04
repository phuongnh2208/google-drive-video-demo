import { HttpStatus } from '@nestjs/common';

export const VideoError = {
  // Lỗi không tìm thấy dữ liệu
  NOT_FOUND: {
    code: 'VIDEO.NOT_FOUND',
    message: 'Video không tồn tại trên hệ thống hoặc đã bị xóa',
    statusCode: HttpStatus.NOT_FOUND,
  },

  INVALID_ID: {
    code: 'VIDEO.INVALID_ID',
    message: 'ID video cung cấp không hợp lệ',
    statusCode: HttpStatus.BAD_REQUEST,
  },

  // Lỗi phân quyền bảo mật cấp độ 1 (Câu 9 - Chưa đăng nhập hệ thống)
  UNAUTHORIZED: {
    code: 'VIDEO.UNAUTHORIZED',
    message: 'Bạn cần phải đăng nhập tài khoản Google để xem video này',
    statusCode: HttpStatus.UNAUTHORIZED,
  },

  // Lỗi phân quyền nâng cao cấp độ 2 (Câu 11 - Chặn email không thuộc whitelist)
  FORBIDDEN_EMAIL: {
    code: 'VIDEO.FORBIDDEN_EMAIL',
    message:
      'Tài khoản Google của bạn không nằm trong danh sách được cấp quyền xem video này',
    statusCode: HttpStatus.FORBIDDEN,
  },

  // Lỗi ràng buộc dữ liệu (Nếu sử dụng tính năng tạo video sau này)
  DUPLICATE_DRIVE_ID: {
    code: 'VIDEO.DUPLICATE_DRIVE_ID',
    message: 'Mã Google Drive File ID này đã tồn tại trong hệ thống',
    statusCode: HttpStatus.CONFLICT,
  },
} as const;
