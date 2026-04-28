import type { UserStatus } from "../../../../generated/prisma/enums";

export type TUserStatusUpdate = {
  status: UserStatus;
};

export type TCategory = {
  name: string;
  icon?: string;
};

export type TCategoryUpdate = Partial<{
  name: string;
  icon: string;
  isActive: boolean;
}>;

export type TCreateSeller = {
  email: string;
  shopName: string;
  licenseNo: string;
  address: string;
};
