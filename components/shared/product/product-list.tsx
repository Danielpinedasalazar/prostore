import { Product } from "@/types";
import ProductCard from "./prosuct-card";

//definimos las props que le pasamos en el archivo app/(root)/page.tsx
export default function ProductList({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) {
  //Si limitedData es igual limit y si este es verdadero ejecuta data.slice, si es falso ejecuta data
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/*Recorremos todo el array con .map, ahora los limitedData los llamamos products y devolvemos el nombre del producto
            si no hay productos devuelve otra cosa*/}
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}
