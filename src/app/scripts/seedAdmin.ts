import { RolesName } from "../../../generated/prisma/enums";
import { config } from "../config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

const seedSuperAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: config.EMAIL,
      },
    });

    if (existingAdmin) {
      throw new Error("Super admin already exists");
    }

    const name = config.NAME;
    const email = config.EMAIL;
    const password = config.PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        "NAME, EMAIL, and PASSWORD environment variables are required for seeding super admin",
      );
    }

    const superAdminData = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: RolesName.ADMIN,
      },
    });

    await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: {
          id: superAdminData.user.id,
        },
        data: {
          emailVerified: true,
          phone: config.PHONE!,
        },
      });
    });
  } catch (error) {}
};

seedSuperAdmin();
