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
import { DeployPage } from '@/pages/DeployPage'
import { DocsIndexPage } from '@/pages/DocsIndexPage'
import { GeneralDocsPage } from '@/pages/docs/GeneralDocsPage'
import { AdminDocsPage } from '@/pages/docs/AdminDocsPage'
import { CustomHtmlDocsPage } from '@/pages/docs/CustomHtmlDocsPage'
import { DatabaseDocsPage } from '@/pages/docs/DatabaseDocsPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/deploy",
    element: <DeployPage />,
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
    path: "/docs",
    element: <DocsIndexPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs/general",
    element: <GeneralDocsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs/admin",
    element: <AdminDocsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs/custom-html",
    element: <CustomHtmlDocsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs/database",
    element: <DatabaseDocsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  // Dynamic catch-all slug must be at the end to prevent collisions with static paths
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