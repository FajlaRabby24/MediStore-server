export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  image?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
  userAgent?: string;
}

export interface IUpdatePayload {
  name?: string;
  phone?: string;
  image?: string;
  shop_name?: string;
  address?: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
