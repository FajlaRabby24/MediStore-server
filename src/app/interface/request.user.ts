import { RolesName } from "../../../generated/prisma";

export interface IRequestUser {
  id: string;
  role: RolesName;
  email: string;
  emailVerified: boolean;
}
