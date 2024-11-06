// lib/services/analytics.ts

import { InstallationEvent } from "@/types/analytics";




export class AnalyticsService {
  static async recordInstallationEvent(event: InstallationEvent) {
    try {
      const response = await fetch('/api/analytics/pwa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to record installation event');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording installation event:', error);
      throw error;
    }
  }

  static async fetchAnalytics(days: number = 30) {
    try {
      const response = await fetch(`/api/analytics/pwa?days=${days}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  static async fetchRealTimeMetrics() {
    try {
      const response = await fetch('/api/analytics/pwa/realtime');

      if (!response.ok) {
        throw new Error('Failed to fetch real-time metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      throw error;
    }
  }
}