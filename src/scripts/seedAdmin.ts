import axios from "axios";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import { sendResponse } from "../utils/sendResponse";

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

    console.log(res?.data);
  } catch (error) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong!";
    sendResponse(400, false, errorMessage);
  }
};

seedAdmin()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
