import { Medicines } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// add new medicine => seller
const addMedicine = async (
  medicine: Omit<Medicines, "id" | "created_at" | "updated_at">,
  sellerId: string,
) => {
  const result = await prisma.medicines.create({
    data: {
      ...medicine,
      seller_id: sellerId,
    },
  });

  return result;
};

export const sellerService = {
  addMedicine,
};
