/* eslint-disable @next/next/no-img-element */
import { TProduct } from '@/db';
import Img from '../Img';

const Product = ({ product }: { product: TProduct }) => {
  return (
    <div className="group relative aspect-square rounded-md border p-5 shadow-sm">
      <div className=" aspect-square h-80 w-full overflow-hidden rounded-md group-hover:opacity-75">
        <Img
          src={'/imgs/shirts/' + product.imageId}
          alt="product image"
          className="h-full w-full object-contain object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Size {product.size.toUpperCase()}, {product.color}
          </p>
        </div>

        <p className="text-sm font-medium text-gray-900">${product.price}</p>
      </div>
    </div>
  );
};

export default Product;
