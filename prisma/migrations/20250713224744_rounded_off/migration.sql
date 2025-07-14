/*
  Warnings:

  - You are about to alter the column `itemsPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `totalPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `shippingPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `taxPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `itemsPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `shippingPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `taxPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `totalPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(12,2)` to `Decimal(12,4)`.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "itemsPrice" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "shippingPrice" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "taxPrice" SET DATA TYPE DECIMAL(12,4);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "itemsPrice" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "shippingPrice" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "taxPrice" SET DATA TYPE DECIMAL(12,4),
ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,4);

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,4);
