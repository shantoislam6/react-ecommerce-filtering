import {
  QueryClient,
  QueryClientProvider as QueryProvider,
} from '@tanstack/react-query';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider client={client}>{children}</QueryProvider>;
}
