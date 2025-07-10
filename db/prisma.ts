import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Habilita WebSocket para conectar con Neon
neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

// Prisma extendido solo con el modelo Product
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        // Asume que product.price es Decimal y lo convierte a string
        compute(product: { price: any }) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: { rating: any }) {
          return product.rating.toString();
        },
      },
    },
  },
});
