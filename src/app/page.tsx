import ProductList from './components/ProductList/Product-list';
import { fetchProducts } from './lib/products';
import {Product} from './types/product-interface'


export default async function HomePage() {
// This runs on the server before sending HTML to the client
  const products: Product[] = await fetchProducts();
  // At this point, products are already loaded,
  // so the initial HTML contains the full list (SSR requirement satisfied)
  return <ProductList initialProducts={products} />;
}