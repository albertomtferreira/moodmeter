// app/unauthorized/page.tsx
"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Button onClick={() => router.back()}>Go Back</Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}