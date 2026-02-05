import { Seller } from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

// make seller profile after login => seller
const makeSellerProfile = async (
  data: Omit<Seller, "id" | "created_at">,
  isVerified: boolean,
  userId: string,
) => {
  const result = await prisma.seller.create({
    data: {
      ...data,
      user_id: userId,
      is_verified: isVerified,
    },
    select: {
      id: true,
      user_id: true,
      shop_name: true,
      license_no: true,
      address: true,
      is_verified: true,
    },
  });

  return result;
};

export const sellerProfileService = {
  makeSellerProfile,
};
