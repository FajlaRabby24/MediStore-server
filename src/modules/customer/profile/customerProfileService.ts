import { prisma } from "../../../lib/prisma";

// get profile info
const getProfileInfo = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return result;
};

export const customerProfileService = {
  getProfileInfo,
};
