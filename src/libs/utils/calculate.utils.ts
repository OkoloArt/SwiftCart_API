import { Product } from '../typeorm/product.entity';

export const calculateAverageRating = (product: Product): number => {
  if (!product || !product.reviews || product.reviews.length === 0) {
    return 0;
  }

  let totalRating = 0;
  for (const review of product.reviews) {
    totalRating += review.rating;
  }

  const averageRating = totalRating / product.reviews.length;
  return Math.max(0, Math.min(averageRating, 5));
};

export const totalRatingCount = (product: Product): number => {
  if (!product || !product.reviews || product.reviews.length === 0) {
    return 0;
  }

  return product.reviews.length;
};
