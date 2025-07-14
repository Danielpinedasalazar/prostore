"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, transformProduct } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

//Get latest
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return transformProduct(data);
}

//Get simple products by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
