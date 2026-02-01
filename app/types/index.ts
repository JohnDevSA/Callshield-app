// Call types and spam classification
export type CallDirection = 'incoming' | 'outgoing' | 'missed';

export type SpamClassification =
  | 'verified'      // Known legitimate business
  | 'contact'       // User's contact
  | 'safe'          // Community-verified safe
  | 'unknown'       // No data available
  | 'low_spam'      // Low confidence spam
  | 'high_spam'     // High confidence spam
  | 'blocked';      // User blocked

export type CallerCategory =
  | 'business'
  | 'bank'
  | 'government'
  | 'delivery'
  | 'healthcare'
  | 'telecoms'
  | 'telemarketer'
  | 'debt_collector'
  | 'scam'
  | 'personal'
  | 'unknown';

// Phone number record in offline database
export interface PhoneNumber {
  id?: number;
  number: string;           // E.164 format (e.g., +27821234567)
  normalizedNumber: string; // Without country code (e.g., 0821234567)
  name?: string;
  category: CallerCategory;
  spamScore: number;        // 0-100, higher = more likely spam
  classification: SpamClassification;
  reportCount: number;
  verifiedBusiness?: boolean;
  lastReported?: Date;
  lastUpdated?: Date;
  source?: 'database' | 'community' | 'user';
}

// Call history entry
export interface CallRecord {
  id?: number;
  phoneNumber: string;
  normalizedNumber: string;
  callerName?: string;
  direction: CallDirection;
  timestamp: Date;
  duration?: number;        // in seconds
  classification: SpamClassification;
  spamScore?: number;
  userFeedback?: 'safe' | 'spam';
  blocked: boolean;
  notes?: string;
}

// Blocked number entry
export interface BlockedNumber {
  id?: number;
  phoneNumber: string;
  normalizedNumber: string;
  name?: string;
  blockedAt: Date;
  reason?: string;
  autoBlocked: boolean;     // true if blocked by auto-block setting
}

// User settings
export interface UserSettings {
  id?: number;
  autoBlockSpam: boolean;
  autoBlockThreshold: number;   // Spam score threshold (0-100)
  showCallOverlay: boolean;
  postCallPrompt: boolean;
  wifiOnlySync: boolean;
  enableNotifications: boolean;
  darkMode: 'system' | 'light' | 'dark';
  language: string;             // e.g., 'en', 'zu', 'af', 'xh'
  lastSyncAt?: Date;
}

// Lookup result from API or database
export interface LookupResult {
  phoneNumber: string;
  found: boolean;
  name?: string;
  category: CallerCategory;
  classification: SpamClassification;
  spamScore: number;
  reportCount: number;
  verifiedBusiness: boolean;
  source: 'offline' | 'online' | 'contact';
}

// Incoming call context for overlay
export interface IncomingCallContext {
  phoneNumber: string;
  lookup?: LookupResult;
  isContact: boolean;
  isBlocked: boolean;
}

// Database sync status
export interface SyncStatus {
  lastSync: Date | null;
  databaseVersion: number;
  totalNumbers: number;
  pendingReports: number;
  isOnline: boolean;
}

// API response types (for future API integration)
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface BulkLookupRequest {
  numbers: string[];
}

export interface BulkLookupResponse {
  results: LookupResult[];
}

export interface ReportSpamRequest {
  phoneNumber: string;
  isSpam: boolean;
  category?: CallerCategory;
  notes?: string;
}