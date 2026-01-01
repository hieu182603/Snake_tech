export enum AccountRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
  SHIPPER = 'SHIPPER'
}

export const getRoleBasePath = (role: AccountRole): string => {
  switch (role) {
    case AccountRole.ADMIN:
      return '/admin';
    case AccountRole.STAFF:
      return '/staff';
    case AccountRole.CUSTOMER:
      return '/customer';
    case AccountRole.SHIPPER:
      return '/shipper';
    default:
      return '/customer';
  }
};