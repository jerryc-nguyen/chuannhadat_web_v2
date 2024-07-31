import { Card } from 'konsta/react';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Card outline key={product?.id}>
      <div
        className='ios:-mx-4 ios:-mt-4 h-48 p-4 flex items-end text-white ios:font-bold bg-cover bg-center material:rounded-xl mb-4 material:text-[22px]'
        style={{
          backgroundImage:
            'url(https://cdn.framework7.io/placeholder/nature-1000x600-3.jpg)',
        }}
      >
        {product?.title}
      </div>
      <div className='text-gray mb-3'>Posted on January 21, 2021</div>
      <p>
        Quisque eget vestibulum nulla. Quisque quis dui quis ex
        ultricies efficitur vitae non felis. Phasellus quis nibh
        hendrerit...
      </p>
    </Card>
  );
}
