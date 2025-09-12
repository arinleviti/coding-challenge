'use client';
import { Button, Row, Col, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useCallback } from 'react';
import { randomDelay } from "../../api/products/route";
import {Product} from '../../../app/page'
import { fetchProducts } from '../../lib/products';
import styles from './Product-list.module.css';
import ProductCard from '../ProductCard/ProductCard';

interface Props {
  initialProducts: Product[];
}
export default function ProductList({ initialProducts }: Props) {

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  async function DeleteProduct(product: Product) {
    try {
    //using an array, in case multiple deletions happen simultaneously
    //each iteration of the function only removed the ID of the product it's working on
    setDeletingIds(prev => [...prev, product.id]);
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, randomDelay(300, 1000)));
    const newProducts = products.filter(p => p.id !== product.id);
    // Remove locally
    setProducts(newProducts);
    // gets the deleted IDs from localStorage, adds the new one, and saves it back
    // this way, deleted products persist across page reloads
    // (since we don't have a backend to actually delete them from)
    // In a real app, you'd make an API call to delete the product on the server
    const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
    localStorage.setItem("deletedIds", JSON.stringify([...deletedIds, product.id]));
  } catch (error) {
    console.error("Error deleting product:", error);
  } finally {
    setDeletingIds(prev => prev.filter(id => id !== product.id));
  }
  }
  // Load products, filtering out any that have been "deleted"
  // This is called on mount, and also when the page regains focus or comes back online
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
    const fetchedProducts = await fetchProducts();
    const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
    const filteredProducts = fetchedProducts.filter(p => !deletedIds.includes(p.id));
    setProducts(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    setProducts([]); // Clear products on error
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  const deletedIds = JSON.parse(localStorage.getItem("deletedIds") || "[]");
  const filteredProducts = initialProducts.filter(p => !deletedIds.includes(p.id));
  setProducts(filteredProducts);
}, [initialProducts]);
/*   useEffect(() => {
    loadProducts();
  }, [loadProducts]); */
  // Set up event listeners for focus and online events
  // When the page regains focus or comes back online, reload products
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

  return (
    <>
      {loading ? (
        <div className={styles.spinnerContainer}>
          <Spinner animation="border" role="status" className={styles.spinnerLarge}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
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
