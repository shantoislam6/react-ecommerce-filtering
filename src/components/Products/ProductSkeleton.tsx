const ProductSkeleton = () => {
  return (
    <div className="relative animate-pulse">
      <div className="lg:aspect-none aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:h-80">
        <div className="h-full w-full bg-gray-200" />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-4 w-full bg-gray-200" />
        <div className="h-4 w-full bg-gray-200" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
