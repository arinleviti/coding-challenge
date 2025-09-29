
import { Product } from '../types/product-interface';

export async function fetchProducts(): Promise<Product[]> {
 const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // server URL
  const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}
