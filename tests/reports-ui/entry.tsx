import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReportsPage from '../../app/(app)/reports/page';

const client = new QueryClient();
createRoot(document.getElementById('root')!).render(<QueryClientProvider client={client}><ReportsPage /></QueryClientProvider>);
