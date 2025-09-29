'use client';
import { Card, Button, Spinner } from "react-bootstrap";
import styles from './ProductCard.module.css';
import {Product} from '../../types/product-interface'


interface Props {
  product: Product;
  deletingIds: number[];
  onDelete: (product: Product) => void;
}

export default function ProductCard({ product, deletingIds, onDelete }: Props) {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={product.image} className={styles.cardImage} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{product.brand}</Card.Subtitle>
        <Card.Text className="mb-1">
          {Array.from({ length: Math.round(product.stars) }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </Card.Text>
        <Card.Text className="mb-1">
          ${product.price.toFixed(2)}
          {product.discounted && ` (-${product.discountPercentage}%)`}
        </Card.Text>
        {product.isBestseller && <Card.Text className="text-success fw-bold">Bestseller</Card.Text>}
        <Button
          variant="danger"
          className="mt-auto"
          onClick={() => onDelete(product)}
          disabled={deletingIds?.includes(product.id) ?? false}
        >
          {deletingIds?.includes(product.id) ? (
            <>
              <Spinner animation="border" size="sm" /> Deleting...
            </>
          ) : "Delete"}
        </Button>
      </Card.Body>
    </Card>
  );
}