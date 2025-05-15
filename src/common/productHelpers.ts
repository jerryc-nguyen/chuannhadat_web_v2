export function featureProductImage(product: A): string | null {
  if (product.featured_image_url) {
    return product.featured_image_url;
  } else if (product.images && product.images.length > 0) {
    return product.images[0]['url'];
  } else {
    return null;
  }
}
