'use client';
import EmptyState from '@/components/Products/EmptyState';
import Product from '@/components/Products/Product';
import ProductSkeleton from '@/components/Products/ProductSkeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { TProduct } from '@/db';
import { cn } from '@/lib/utils';
import { TProductFilterOptions } from '@/lib/validators/products-validator';
import { useQuery } from '@tanstack/react-query';
import { QueryResult } from '@upstash/vector';
import axios from 'axios';
import { debounce } from 'lodash';
import { ChevronDown, Filter } from 'lucide-react';
import { useCallback, useState } from 'react';

const SORT_OPTIONS = [
  {
    label: 'None',
    value: 'none',
  },
  {
    label: 'Price: Low to High',
    value: 'price-asc',
  },
  {
    label: 'Price: High to Low',
    value: 'price-desc',
  },
] as const;

const COLOR_FILTERS = {
  id: 'color',
  name: 'Color',
  options: [
    { value: 'white', label: 'White' },
    { value: 'beige', label: 'Beige' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
  ] as const,
};

const SIZE_FILTERS = {
  id: 'size',
  name: 'Size',
  options: [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
  ],
} as const;

const PRICE_FILTERS = {
  id: 'price',
  name: 'Price',
  options: [
    { value: [0, 100], label: 'Any price' },
    {
      value: [0, 20],
      label: 'Under 20$',
    },
    {
      value: [0, 40],
      label: 'Under 40$',
    },
    // custom option defined in JSX
  ],
} as const;

const SUBCATEGORIES = [
  { name: 'T-Shirts', selected: true, href: '#' },
  { name: 'Hoodies', selected: false, href: '#' },
  { name: 'Sweatshirts', selected: false, href: '#' },
  { name: 'Accessories', selected: false, href: '#' },
];

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];
export default function Home() {
  const [filter, setFilter] = useState<TProductFilterOptions>({
    sort: 'none',
    color: ['white', 'beige', 'blue', 'green', 'purple'],
    price: {
      isCustom: false,
      range: DEFAULT_CUSTOM_PRICE,
    },
    size: ['L', 'M', 'S'],
  });

  const {
    data: products,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>(
        process.env.NEXT_PUBLIC_SITE_URL + '/api/products',
        {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
        }
      );
      return data;
    },
  });

  const onSubmit = debounce(refetch, 400);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(onSubmit, []);

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, 'price' | 'sort'>;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);
    setFilter((prev) => ({
      ...prev,
      [category]: isFilterApplied
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
    debouncedSubmit();
  };

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

  return (
    <main className="max-container p-5">
      <div className="flex items-baseline justify-between gap-4 border-b  pb-6 pt-24">
        <h1 className="text-3xl font-bold tracking-tight text-foreground/80">
          High Quality Cotton Selection
        </h1>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center p-2 text-sm font-medium text-foreground/60 hover:text-foreground data-[state=open]:text-foreground">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <button
                  className={cn(
                    'block w-full px-4 py-2 text-left text-sm text-foreground/70 ',
                    {
                      'bg-muted !text-foreground': option.value == filter.sort,
                    }
                  )}
                  key={option.value}
                  onClick={() => {
                    if (option.value != filter.sort) {
                      setFilter((prev) => ({
                        ...prev,
                        sort: option.value,
                      }));
                      debouncedSubmit();
                    }
                  }}
                >
                  {option.label}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="-m-2 ml-4 text-foreground/60 hover:text-foreground">
            <Filter className=" h-5 w-5 " />
          </button>
        </div>
      </div>
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-4">
          {/* Filter */}
          <div className="sticky hidden md:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUBCATEGORIES.map((category) => (
                <li key={category.name}>
                  <button
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
            <Accordion
              type="multiple"
              className="animate-none"
            >
              {/* Color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>
                <AccordionContent className="animate-none pt-6">
                  <ul className="space-y-4">
                    {COLOR_FILTERS.options.map((option, optionIdx) => (
                      <li
                        className="flex items-center"
                        key={option.value}
                      >
                        <Checkbox
                          id={`color-${optionIdx}`}
                          onCheckedChange={() => {
                            applyArrayFilter({
                              category: 'color',
                              value: option.value,
                            });
                          }}
                          checked={filter.color.includes(option.value)}
                        />
                        <label
                          htmlFor={`color-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Size filter */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>
                <AccordionContent className="animate-none pt-6">
                  <ul className="space-y-4">
                    {SIZE_FILTERS.options.map((option, optionIdx) => (
                      <li
                        className="flex items-center"
                        key={option.value}
                      >
                        <Checkbox
                          id={`size-${optionIdx}`}
                          onCheckedChange={() => {
                            applyArrayFilter({
                              category: 'size',
                              value: option.value,
                            });
                          }}
                          checked={filter.size.includes(option.value)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`size-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Price filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="animate-none pt-6">
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, optionIdx) => (
                      <li
                        className="flex items-center"
                        key={option.label}
                      >
                        <input
                          type="radio"
                          id={`price-${optionIdx}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));
                            debouncedSubmit();
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex flex-col gap-5">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                ...prev.price,
                                isCustom: true,
                              },
                            }));
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          Custom
                        </label>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}
                          $ -{' '}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}
                          $
                        </div>
                      </div>
                      <div>
                        <Slider
                          className={cn({
                            'opacity-50': !filter.price.isCustom,
                          })}
                          disabled={!filter.price.isCustom}
                          onValueChange={(range) => {
                            const [newMin, newMax] = range;
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [newMin, newMax],
                              },
                            }));
                            debouncedSubmit();
                          }}
                          value={filter.price.range}
                          min={DEFAULT_CUSTOM_PRICE[0]}
                          max={DEFAULT_CUSTOM_PRICE[1]}
                          step={5}
                        />
                      </div>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {/* TProduct Grid */}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
            {products && products.length === 0 ? (
              <EmptyState />
            ) : products && !isRefetching ? (
              products.map((product) => (
                <Product
                  key={product.id}
                  product={product.metadata!}
                />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, i) => <ProductSkeleton key={i} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
