export const ResponseMessage = {
  AUTH: {
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    INVALID_TOKEN: 'Token không hợp lệ',
    UNAUTHORIZED: 'Bạn chưa đăng nhập',
    EMAIL_NOT_ALLOWED: 'Email của bạn không có quyền truy cập',
  },
  VIDEO: {
    CREATE_SUCCESS: 'Tạo video thành công',
    FETCH_SUCCESS: 'Lấy danh sách video thành công',
    NOT_FOUND: 'Không tìm thấy video',
  },
} as const;
