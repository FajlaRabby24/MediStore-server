import { Cart } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// get all cart of current user/customer
const getAllCartOfCurrentUser = async (userId: string) => {
  const result = await prisma.cart.findMany({
    where: {
      user_id: userId,
    },
  });

  return result;
};

// find medicine by id
const getMedicineById = async (medicineId: string) => {
  const result = await prisma.medicines.findUnique({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      stock: true,
    },
  });

  return result;
};

// add to cart => user/customer
const addToCart = async (
  data: Omit<Cart, "id" | "created_at">,
  userId: string,
) => {
  const medicine = await getMedicineById(data.medicine_id);
  if (!medicine) {
    throw new Error("No medcine found of these id.");
  }

  const result = await prisma.cart.create({
    data: {
      ...data,
      user_id: userId,
    },
  });

  return result;
};

// update medicine stock
const updateMedicineStock = async (medicineId: string, stock: number) => {
  const result = await prisma.medicines.update({
    where: {
      id: medicineId,
    },
    data: {
      stock: {
        decrement: stock,
      },
    },
    select: {
      id: true,
    },
  });
};

// update cart item quantity
// TODO: quantity must be positive check in client side
const updateQuantity = async (medicineId: string, value: number) => {
  const medicine = await getMedicineById(medicineId);

  if (!medicine) {
    throw new Error("Medicine not found!");
  }

  const result = await prisma.cart.update({
    where: {
      id: medicineId,
    },
    data: {
      quantity: {
        increment: value,
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });

  return result;
};

// delete cart item => user/ customer
const deleteCartItem = async (medicineId: string) => {
  const medicine = await prisma.cart.findUnique({
    where: {
      id: medicineId,
    },
  });

  if (!medicine) {
    throw new Error("Medicine not found!");
  }

  const result = await prisma.cart.delete({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
    },
  });

  return result;
};

// delete all items in cart by array of id => user/customer
const deleteCartItemAll = async (medicineIds: string[]) => {
  const result = await prisma.cart.deleteMany({
    where: {
      id: {
        in: medicineIds,
      },
    },
  });

  return result;
};

// checkout
// const checkOut = async (userId: string) => {
//   // get cart of current user
//   const cart = await getAllCartOfCurrentUser(userId);

//   if (cart.length < 1) {
//     throw new Error(
//       "Your cart is empty. First Add some product on your cart. Thank you!",
//     );
//   }

//   // cart.map((cartItem: Cart) => (cartItem.))
// };

export const cartService = {
  addToCart,
  updateQuantity,
  deleteCartItem,
  deleteCartItemAll,
  getAllCartOfCurrentUser,
};
