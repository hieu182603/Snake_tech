export enum AccountRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
  SHIPPER = 'SHIPPER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PACKING = 'PACKING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export enum PaymentMethod {
  COD = 'COD',
  VNPAY = 'VNPAY',
  MOCK = 'MOCK'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentProviderStatus {
  INIT = 'INIT',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum OtpPurpose {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  RESET_PASSWORD = 'RESET_PASSWORD'
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum BannerPosition {
  HOME_TOP = 'HOME_TOP',
  HOME_MID = 'HOME_MID',
  CATEGORY_TOP = 'CATEGORY_TOP'
}

export enum NotificationType {
  ORDER_STATUS = 'ORDER_STATUS',
  PROMO = 'PROMO',
  SYSTEM = 'SYSTEM'
}

export enum ImageProvider {
  CLOUDINARY = 'CLOUDINARY',
  S3 = 'S3',
  LOCAL = 'LOCAL'
}

export enum ImageOwnerType {
  ACCOUNT = 'ACCOUNT',
  PRODUCT = 'PRODUCT',
  REVIEW = 'REVIEW',
  BANNER = 'BANNER',
  RFQ = 'RFQ',
  SYSTEM = 'SYSTEM'
}

export enum RFQType {
  CUSTOM_PC = 'CUSTOM_PC',
  BULK_ORDER = 'BULK_ORDER',
  SPECIAL_PRODUCT = 'SPECIAL_PRODUCT'
}

export enum RFQStatus {
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  QUOTED = 'QUOTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}
