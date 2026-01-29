import type { CallRecord, BlockedNumber, PhoneNumber } from '~/types';
import { useDatabase } from '~/composables/useDatabase';

// Mock SA phone numbers with realistic data
const mockPhoneNumbers: Omit<PhoneNumber, 'id'>[] = [
  {
    number: '+27 11 234 5678',
    normalizedNumber: '0112345678',
    name: undefined,
    classification: 'high_spam',
    category: 'telemarketer',
    spamScore: 92,
    reportCount: 847,
    lastReported: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    verifiedBusiness: false
  },
  {
    number: '+27 87 575 9404',
    normalizedNumber: '0875759404',
    name: 'FNB Customer Service',
    classification: 'verified',
    category: 'bank',
    spamScore: 0,
    reportCount: 0,
    verifiedBusiness: true
  },
  {
    number: '+27 21 555 6789',
    normalizedNumber: '0215556789',
    name: undefined,
    classification: 'low_spam',
    category: 'unknown',
    spamScore: 45,
    reportCount: 12,
    lastReported: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    verifiedBusiness: false
  },
  {
    number: '+27 11 111 2222',
    normalizedNumber: '0111112222',
    name: undefined,
    classification: 'high_spam',
    category: 'debt_collector',
    spamScore: 85,
    reportCount: 234,
    lastReported: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    verifiedBusiness: false
  },
  {
    number: '+27 82 333 4444',
    normalizedNumber: '0823334444',
    name: 'Mom',
    classification: 'contact',
    category: 'personal',
    spamScore: 0,
    reportCount: 0,
    verifiedBusiness: false
  },
  {
    number: '+27 82 999 8888',
    normalizedNumber: '0829998888',
    name: undefined,
    classification: 'unknown',
    category: 'unknown',
    spamScore: 0,
    reportCount: 0,
    verifiedBusiness: false
  },
  {
    number: '+27 10 500 1234',
    normalizedNumber: '0105001234',
    name: 'Vodacom',
    classification: 'verified',
    category: 'telecoms',
    spamScore: 0,
    reportCount: 0,
    verifiedBusiness: true
  },
  {
    number: '+27 11 999 0000',
    normalizedNumber: '0119990000',
    name: undefined,
    classification: 'high_spam',
    category: 'scam',
    spamScore: 98,
    reportCount: 1523,
    lastReported: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    verifiedBusiness: false
  }
];

const mockCallHistory: Omit<CallRecord, 'id'>[] = [
  {
    phoneNumber: '+27 82 333 4444',
    normalizedNumber: '0823334444',
    callerName: 'Mom',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 300,
    classification: 'contact',
    blocked: false
  },
  {
    phoneNumber: '+27 11 234 5678',
    normalizedNumber: '0112345678',
    direction: 'missed',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    classification: 'high_spam',
    blocked: true
  },
  {
    phoneNumber: '+27 87 575 9404',
    normalizedNumber: '0875759404',
    callerName: 'FNB Customer Service',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    duration: 180,
    classification: 'verified',
    blocked: false
  },
  {
    phoneNumber: '+27 82 999 8888',
    normalizedNumber: '0829998888',
    direction: 'missed',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000), // yesterday
    classification: 'unknown',
    blocked: false
  },
  {
    phoneNumber: '+27 21 555 6789',
    normalizedNumber: '0215556789',
    direction: 'missed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    classification: 'low_spam',
    blocked: false
  },
  {
    phoneNumber: '+27 11 111 2222',
    normalizedNumber: '0111112222',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    classification: 'high_spam',
    blocked: true
  },
  {
    phoneNumber: '+27 10 500 1234',
    normalizedNumber: '0105001234',
    callerName: 'Vodacom',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 120,
    classification: 'verified',
    blocked: false
  },
  {
    phoneNumber: '+27 11 999 0000',
    normalizedNumber: '0119990000',
    direction: 'missed',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    classification: 'high_spam',
    blocked: true
  },
  {
    phoneNumber: '+27 82 333 4444',
    normalizedNumber: '0823334444',
    callerName: 'Mom',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 420,
    classification: 'contact',
    blocked: false
  }
];

const mockBlockedNumbers: Omit<BlockedNumber, 'id'>[] = [
  {
    phoneNumber: '+27 11 234 5678',
    normalizedNumber: '0112345678',
    name: undefined,
    blockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reason: 'Telemarketer',
    autoBlocked: true
  },
  {
    phoneNumber: '+27 21 555 6789',
    normalizedNumber: '0215556789',
    name: undefined,
    blockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reason: 'Scam attempt',
    autoBlocked: false
  },
  {
    phoneNumber: '+27 11 111 2222',
    normalizedNumber: '0111112222',
    name: undefined,
    blockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    reason: 'Debt collector',
    autoBlocked: true
  },
  {
    phoneNumber: '+27 11 999 0000',
    normalizedNumber: '0119990000',
    name: undefined,
    blockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reason: 'SARS impersonation scam',
    autoBlocked: true
  }
];

export function useMockData() {
  const { db, initDatabase } = useDatabase();

  async function seedDatabase(): Promise<boolean> {
    try {
      // Check if already seeded
      const existingCalls = await db.callHistory.count();
      if (existingCalls > 0) {
        console.log('[CallShield] Database already seeded');
        return false;
      }

      await initDatabase();

      // Seed phone numbers
      await db.phoneNumbers.bulkAdd(mockPhoneNumbers as PhoneNumber[]);

      // Seed call history
      await db.callHistory.bulkAdd(mockCallHistory as CallRecord[]);

      // Seed blocked numbers
      await db.blockedNumbers.bulkAdd(mockBlockedNumbers as BlockedNumber[]);

      console.log('[CallShield] Database seeded with mock data');
      return true;
    } catch (error) {
      console.error('[CallShield] Failed to seed database:', error);
      return false;
    }
  }

  async function clearMockData(): Promise<void> {
    await db.phoneNumbers.clear();
    await db.callHistory.clear();
    await db.blockedNumbers.clear();
    console.log('[CallShield] Mock data cleared');
  }

  return {
    seedDatabase,
    clearMockData
  };
}