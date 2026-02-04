import { PaymentMethods, PaymentStatus } from "../../../constant";
import { prisma } from "../../../lib/prisma";

// load cart items for checkout page
const loadCartItems = async (userId: string) => {
  const cartItems = await prisma.cart.findMany({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
      quantity: true,
      medicines: {
        select: {
          id: true,
          name: true,
          image: true,
          price: true,
          stock: true,
          isActive: true,
          expiry_date: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      seller: {
        select: {
          id: true,
          is_verified: true,
          shop_name: true,
          user: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!cartItems.length) {
    throw new Error("Your cart is empty");
  }

  // validate items
  const validItems: any[] = [];
  const invalidItems: any[] = [];

  for (const item of cartItems) {
    const medicine = item.medicines;
    const seller = item.seller;

    if (!medicine.isActive) {
      invalidItems.push({ id: item.id, reason: "Medicine inactive" });
      continue;
    }

    if (medicine.expiry_date && medicine.expiry_date < new Date()) {
      invalidItems.push({ id: item.id, reason: "Medicine expired" });
      continue;
    }

    if (medicine.stock < item.quantity) {
      invalidItems.push({ id: item.id, reason: "Out of stock" });
      continue;
    }

    if (!seller.is_verified || seller.user.status !== "ACTIVE") {
      invalidItems.push({ id: item.id, reason: "Seller inactive" });
      continue;
    }

    validItems.push(item);
  }

  // handle partial
  if (!validItems.length) {
    throw new Error("All cart items are unavailable");
  }

  if (invalidItems.length) {
    await prisma.cart.deleteMany({
      where: { id: { in: invalidItems.map((i) => i.id) } },
    });
  }

  // calculate price
  let total = 0;
  for (const item of validItems) {
    total += Number(item.medicines.price) * item.quantity;
  }

  return {
    validItems,
    invalidItems,
    totalPrice: total,
  };
};

// checkout
const checkout = async (
  userId: string,
  payload: { paymentMethod: PaymentMethods },
) => {
  // load cart
  const cartItems = await loadCartItems(userId);

  let paymentStatus = PaymentStatus.PENDING;
  let paidAt: Date | null = null;
  if (payload.paymentMethod !== PaymentMethods.COD) {
    paymentStatus = PaymentStatus.PAID;
    paidAt = new Date();
  }

  // prisma transaction
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.orders.create({
      data: {
        user_id: userId,
        total_price: cartItems.totalPrice,
      },
    });

    for (const item of cartItems.validItems) {
      await tx.orderItems.create({
        data: {
          order_id: order.id,
          seller_id: item.seller.id,
          medicine_id: item.medicines.id,
          quantity: item.quantity,
          price: item.medicines.price,
        },
      });

      await tx.medicines.update({
        where: { id: item.medicines.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cart.deleteMany({ where: { user_id: userId } });

    const payment = await tx.payments.create({
      data: {
        order_id: order.id,
        amount: order.total_price,
        method: payload.paymentMethod,
        payment_status: paymentStatus,
        paid_at: paidAt,
      },
      select: {
        id: true,
        order_id: true,
        method: true,
        amount: true,
      },
    });

    return {
      order,
      payment,
    };
  });

  return result;
};

export const customerCheckoutService = {
  loadCartItems,
  checkout,
};
