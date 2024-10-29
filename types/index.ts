import { UserRole } from "@prisma/client";

// Emotion type for the different mood options
export type Mood = 'happy' | 'okay' | 'unhappy';

// School type
export interface School {
  id: string;
  name: string;
  code: string;
  color: string;
}

// Settings type
export interface UserSettings {
  userId: string;
  theme?: string;
  notifications?: boolean;
  language: string;
  defaultSchool?: string; // ID of the default school for the user
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
  clerkId: string;
  username: string;
  email: string;
  role: UserRole;
  schools: Array<{
    school: School;
  }>;
  settings: UserSettings;
  hasSchools?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithPermissions extends User {
  permissions?: string[];
}

export interface APIError {
  error: string;
  message: string;
  details?: string;
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



// Offline feedback type (for storing feedback when offline)
export interface OfflineFeedback extends Omit<Feedback, 'id'> {
  synced: boolean;
}