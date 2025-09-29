export interface Product {
  id: number;
  name: string;
  brand: string;
  stars: number;
  price: number;
  isBestseller: boolean;
  discounted: boolean;
  discountPercentage: number;
  image: string;
}