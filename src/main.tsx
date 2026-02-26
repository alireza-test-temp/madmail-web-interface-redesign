import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();

import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { InfoPage } from '@/pages/InfoPage'
import { SecurityPage } from '@/pages/SecurityPage'
import { ShareContactPage } from '@/pages/ShareContactPage'
import { ContactViewPage } from '@/pages/ContactViewPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/info",
    element: <InfoPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/security",
    element: <SecurityPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/share",
    element: <ShareContactPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/:slug",
    element: <ContactViewPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </QueryClientProvider>
)