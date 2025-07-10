import ProductList from "@/components/shared/product/product-list"; //pasamos la lista de productos
import { getLatestProducts } from "@/lib/actions/product.actions";

export default async function HomePAge() {
  const latestProducts = await getLatestProducts();
  return (
    <>
      {/*A los productos le pasamos 3 props:
    data: va a tomar todos los productos
    limit: limite de productos a mostrar */}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  );
}
