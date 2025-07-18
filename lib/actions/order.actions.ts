"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { cartItem } from "@/types";
import { Order } from "@/types";

export async function createOrder() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    //Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    //Create a transaction to create order or order items in db
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create order
      const insertedOrder = await tx.order.create({ data: order });
      //Create order items from the cart items
      for (const item of cart.items as cartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //clear the cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });
      return insertedOrder.id;
    });

    if (!insertedOrderId) {
      throw new Error("Order not created");
    }

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

function mapPrismaOrderToOrder(prismaOrder: any): Order {
  return {
    id: prismaOrder.id,
    userId: prismaOrder.userId,
    itemsPrice: prismaOrder.itemsPrice,
    shippingPrice: prismaOrder.shippingPrice,
    taxPrice: prismaOrder.taxPrice,
    totalPrice: prismaOrder.totalPrice,
    paymentMethod: prismaOrder.paymentMethod,
    shippingAddress: prismaOrder.shippingAddress,
    createdAt: prismaOrder.createdAt,
    isPaid: prismaOrder.isPaid,
    paidAt: prismaOrder.paidAt,
    isDelivered: prismaOrder.isDelivered,
    deliveredAt: prismaOrder.deliveredAt,
    orderItems: prismaOrder.orderitems, // Map orderitems to orderItems
    user: prismaOrder.user,
  };
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!data) {
    return null;
  }

  const order = mapPrismaOrderToOrder(data);
  return convertToPlainObject(order);
}
