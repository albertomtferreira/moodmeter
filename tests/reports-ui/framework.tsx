// Isolated preview adapters. These are bundled only by tests/reports-ui/server.ts.
import { AnchorHTMLAttributes, useSyncExternalStore } from 'react';

export function useAuth() { return { isLoaded: true, isSignedIn: true, userId: 'preview-user' }; }
if (typeof window !== 'undefined') {
  for (const method of ['pushState', 'replaceState'] as const) {
    const original = window.history[method].bind(window.history);
    window.history[method] = (...args: Parameters<History[typeof method]>) => {
      original(...args);
      window.dispatchEvent(new Event('preview-navigation'));
    };
  }
}
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('preview-navigation', callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener('preview-navigation', callback); };
}
export function useSearchParams() {
  return new URLSearchParams(useSyncExternalStore(subscribe, () => window.location.search, () => ''));
}
export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} />; }
