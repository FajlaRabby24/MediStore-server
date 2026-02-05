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

// edit profile info => user/customer
const editProfile = async (
  userId: string,
  payload: {
    name?: string;
    image?: string;
    phone?: string;
  },
) => {
  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
  });

  return result;
};

export const customerProfileService = {
  getProfileInfo,
  editProfile,
};
