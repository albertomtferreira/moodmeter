// Emotion type for the different mood options
export type Mood = 'happy' | 'okay' | 'unhappy';

// School type
export interface School {
  id: string;
  name: string;
  color: string;
}

// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string
  firstName: string
  lastName: string
  email: string
}

// User type
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'school_admin' | 'user';
  schools: string[]; // Array of school IDs the user has access to
}



// Feedback type
export interface Feedback {
  id: string;
  userId: string; // ID of the user who submitted the feedback (if available)
  schoolId: string;
  emotion: Mood;
  timestamp: Date;
}

// Aggregated feedback data type (for reports)
export interface AggregatedFeedback {
  schoolId: string;
  date: Date;
  happyCount: number;
  okayCount: number;
  unhappyCount: number;
  totalCount: number;
}

// Report type
export interface Report {
  id: string;
  schoolId: string;
  startDate: Date;
  endDate: Date;
  data: AggregatedFeedback[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Settings type
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark';
  language: string;
  defaultSchool?: string; // ID of the default school for the user
}

// Offline feedback type (for storing feedback when offline)
export interface OfflineFeedback extends Omit<Feedback, 'id'> {
  synced: boolean;
}