import type { RolesName } from "../../../generated/prisma/enums";

export interface IRequestUser {
  id: string;
  role: RolesName;
  email: string;
  emailVerified: boolean;
}
