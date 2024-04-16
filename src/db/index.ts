import { Index } from '@upstash/vector';

export type TProduct = {
  id: string;
  imageId: string;
  name: string;
  size: 'S' | 'M' | 'L';
  color: 'white' | 'beige' | 'blue' | 'green' | 'purple';
  price: number;
};

export const db = new Index<TProduct>();
