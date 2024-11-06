// app/(app)/analytics/pwa/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface InstallationMetrics {
  totalAttempts: number;
  successRate: number;
  platformBreakdown: {
    platform: string;
    count: number;
  }[];
  sourceBreakdown: {
    source: string;
    count: number;
  }[];
  dailyInstalls: {
    date: string;
    attempts: number;
    completions: number;
  }[];
}

const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3'];

export default function PWAAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<InstallationMetrics | null>(null);

  useEffect(() => {
    // Fetch your analytics data here
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/pwa');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching PWA analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">PWA Installation Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(metrics.successRate * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Installations</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.dailyInstalls}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attempts" fill="#4CAF50" name="Attempts" />
                <Bar dataKey="completions" fill="#2196F3" name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.platformBreakdown}
                  dataKey="count"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {metrics.platformBreakdown.map((entry, index) => (
                    <Cell key={entry.platform} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}