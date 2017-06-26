import language from 'react-native-i18n'

language.fallbacks = true

language.translations = {

  'vi-VN': {
    user_profile: "Thông tin cá nhân",
    setup_account: "Cài đặt tài khoản",
    full_name: "Tên tài khoản",
    phone_number: "Số điện thoại",
    name_form: "Tên:",
    birthday_form: "Ngày sinh:",
    phone_form: "SĐT:",
    email_form: "Email:",
    image_form: "Ảnh đại diện:",
    upload_image: "Tải ảnh",
    save: "Lưu",
    cancel: "Hủy",
    sending: "Đang gửi...",
    sent_request: "Bạn đã gửi yêu cầu. Vui lòng gửi lại sau.",
    update_success: "Cập nhật thành công.",
    edit: "Chỉnh sửa",
    logout: "Đăng xuất",
    send: "Gửi",
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    choose: "Chọn",
    choose_a_month: "Chọn 1 tháng",
    all: "Tất cả",
    forget_password: "Quên mật khẩu",
    update_ip: 'Cập nhật các IP được phép check in/out',
    view_list_employee: "Xem danh sách nhân viên",
    request_off: 'Yêu cầu xin nghỉ',
    info: "Thông tin",
    total_work_hour: "Tổng số giờ công",
    detail_salary: "Chi tiết bảng lương",
    checkIn_checkOut: "Check in/Check out",
    employee_info: "Thông tin cá nhân",
    work_sheet: "Ca làm việc",
    choose: "Chọn",
    choose_a_month: "Chọn 1 tháng",
  },
  'en': {
    user_profile: "Thông tin cá nhân",
    setup_account: "Cài đặt tài khoản",
    full_name: "Tên tài khoản",
    phone_number: "Số điện thoại",
    name_form: "Tên:",
    birthday_form: "Ngày sinh:",
    phone_form: "SĐT:",
    email_form: "Email:",
    image_form: "Ảnh đại diện:",
    upload_image: "Tải ảnh",
    save: "Lưu",
    cancel: "Hủy",
    sending: "Đang gửi...",
    sent_request: "Bạn đã gửi yêu cầu. Vui lòng gửi lại sau.",
    update_success: "Cập nhật thành công.",
    edit: "Chỉnh sửa",
    logout: "Đăng xuất",
    send: "Gửi",
    username: "Tên đăng nhập",
    password: "Mật khẩu",
    choose: "Chọn",
    choose_a_month: "Chọn 1 tháng",
    all: "Tất cả",
    forget_password: "Quên mật khẩu",
    update_ip: 'Cập nhật các IP được phép check in/out',
    view_list_employee: "Xem danh sách nhân viên",
    request_off: 'Yêu cầu xin nghỉ',
    info: "Thông tin",
    total_work_hour: "Tổng số giờ công",
    detail_salary: "Chi tiết bảng lương",
    checkIn_checkOut: "Check in/Check out",
    employee_info: "Thông tin cá nhân",
    work_sheet: "Ca làm việc",
    choose: "Chọn",
    choose_a_month: "Chọn 1 tháng",

  }

}

export const get = (key) => {
  return language.t(key);
};

export const getLocale = () => {
  return language.locale;
};

export const setLocale = (item) => {
    let languageCode = item.substr(0,2);
    language.locale = languageCode;
}
