import ProductCard from './ProductCard';

export default function PostList({ products }: { products: Array<A> }) {
  return (
    <>
      <div className="c-content__gridWrap">
        <div className="c-content__grid">
          {products.map((product: A) => {
            return (
              <div
                key={product?.id}
                className="min-720:gap-y-5 group relative flex flex-col gap-y-5"
              >
                <div className="min-720:rounded-28 min-720:bg-bg-secondary min-720:px-28 min-720:pb-28 min-720:pt-24 relative p-[1px]">
                  <ProductCard key={product?.id} product={product} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
