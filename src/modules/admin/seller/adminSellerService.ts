import { prisma } from "../../../lib/prisma";

// get seller by seller id
const getSellerBySellerId = async (sellerId: string) => {
  const seller = await prisma.seller.findUnique({
    where: {
      id: sellerId,
    },
    select: {
      id: true,
      is_verified: true,
    },
  });

  if (!seller) {
    throw new Error("No seller found of these id!");
  }

  return seller;
};

// update seller verification is_verified => admin
const updateSellerVerify = async (
  sellerId: string,
  payload: { isVerify: boolean },
) => {
  const seller = await getSellerBySellerId(sellerId);

  if (seller.is_verified === payload.isVerify) {
    throw new Error("Already update to date.");
  }

  const result = await prisma.seller.update({
    where: {
      id: sellerId,
    },
    data: {
      is_verified: payload.isVerify,
    },
    select: {
      id: true,
      is_verified: true,
    },
  });

  return result;
};

export const adminSellerService = {
  updateSellerVerify,
};
