// types/analytics.ts
export interface InstallationEvent {
  source: 'HERO_BUTTON' | 'MOBILE_BANNER' | 'BROWSER_PROMPT';
  stage: 'PROMPTED' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'FAILED';
  platform: 'WINDOWS' | 'MAC' | 'ANDROID' | 'IOS' | 'OTHER';
  errorMessage?: string;
  deviceInfo?: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalAttempts: number;
  successRate: number;
  errorRate: number;
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
  recentErrors: {
    timestamp: Date;
    errorMessage: string | null;
    platform: string;
    source: string;
  }[];
}

export interface RealTimeMetrics {
  currentActiveInstalls: number;
  lastHourAttempts: number;
  lastHourCompletions: number;
  recentEvents: InstallationEvent[];
}