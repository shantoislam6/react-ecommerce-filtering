import { XCircle } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="relative col-span-full flex h-80 w-full flex-col items-center justify-center  p-12">
      <XCircle className="h-8 w-8 text-red-500" />
      <h3 className="text-xl font-semibold">No products found</h3>
      <p className="text-sm text-zinc-500">
        We found no search results for these filters.
      </p>
    </div>
  );
};

export default EmptyState;
