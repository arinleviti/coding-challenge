'use client';

import { Button, Row, Col, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '../../../app/types/product-interface';
import { fetchProducts } from '../../lib/products';
import styles from './Product-list.module.css';
import ProductCard from '../ProductCard/ProductCard';
import ErrorComponent from '../../error';

interface Props {
  initialProducts: Product[];
}

export default function ProductList({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Delete a product
  async function DeleteProduct(product: Product) {
    try {
      setDeletingIds(prev => [...prev, product.id]);

      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product on server");

      setProducts(prev => prev.filter(p => p.id !== product.id));

      const deletedIds: number[] = JSON.parse(localStorage.getItem("deletedIds") || "[]");
      localStorage.setItem("deletedIds", JSON.stringify([...deletedIds, product.id]));
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error("Error deleting product:", errorObj);
      setError(errorObj);
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== product.id));
    }
  }

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await fetchProducts();
      const deletedIds: number[] = JSON.parse(localStorage.getItem("deletedIds") || "[]");
      setProducts(fetchedProducts.filter(p => !deletedIds.includes(p.id)));
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error("Error fetching products:", errorObj);
      setError(errorObj);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const deletedIds: number[] = JSON.parse(localStorage.getItem("deletedIds") || "[]");
    setProducts(initialProducts.filter(p => !deletedIds.includes(p.id)));
  }, [initialProducts]);

  useEffect(() => {
    const handleFocus = () => loadProducts();
    const handleOnline = () => loadProducts();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("online", handleOnline);
    };
  }, [loadProducts]);

  const restoreProducts = () => {
    localStorage.removeItem("deletedIds");
    loadProducts();
  };

  // **If there's an error, render only the ErrorComponent**
  if (error) return <ErrorComponent error={error} reset={restoreProducts} />;

  return (
    <>
      {loading && (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status" className={styles.spinnerLarge}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!loading && (
        <>
          <Row className="g-4 p-4">
            {products.map(product => (
              <Col key={product.id} xs={12} sm={6} lg={4}>
                <ProductCard
                  product={product}
                  deletingIds={deletingIds}
                  onDelete={DeleteProduct}
                />
              </Col>
            ))}
          </Row>
          <Button
            variant="primary"
            onClick={restoreProducts}
            className={styles.restoreButton}
          >
            Restore Products
          </Button>
        </>
      )}
    </>
  );
}
