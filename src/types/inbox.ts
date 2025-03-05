
export interface Contact {
  id: string;
  name: string;
  email?: string;
  handle?: string;
  avatar?: string;
  company?: string;
  position?: string;
  lastContactDate?: string;
  isFollowing?: boolean;
  platform: 'email' | 'linkedin' | 'twitter';
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isIncoming: boolean;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface Thread {
  id: string;
  contactId: string;
  subject?: string;
  lastMessageTimestamp: string;
  messages: Message[];
  isRead: boolean;
}
