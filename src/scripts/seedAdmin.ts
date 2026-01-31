import axios from "axios";
import { config } from "../config";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: config.admin_name,
      email: config.admin_email,
      password: config.admin_password,
      phone: config.admin_phone,
      role: config.admin_role,
      emailVerified: true,
    };

    // check user exist on db or not
    const isExistgUser = await prisma.user.findUnique({
      where: {
        email: config.admin_email!,
      },
    });

    if (isExistgUser) {
      throw new Error("User/Admin already exists!");
    }

    // sign up admin
    const res = await axios.post(
      `${config.server_url}/api/auth/sign-up/email`,
      adminData,
      {
        headers: {
          origin: config.app_url,
        },
      },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    throw new Error(errorMessage);
  }
};

seedAdmin()
  .then(async () => {
    console.log("Seeding finished");
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    console.error("Seeding failed:", err);
    process.exit(1);
  });
