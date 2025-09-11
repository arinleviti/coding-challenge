import products from '../../../../data/products.json';
import { NextResponse } from 'next/server';

export const randomDelay = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, randomDelay(500, 1500)));
  return NextResponse.json(products);
}