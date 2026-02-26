/**
 * Minimal real-world demo: One Durable Object instance per entity (User, ChatBoard, Contact), with Indexes for listing.
 */
import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, Account } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
// USER ENTITY: handles both basic users and full accounts
export class UserEntity extends IndexedEntity<Account> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: Account = { id: "", name: "", password: "", email: "" };
  // Convert mock users to accounts for compatibility
  static seedData = MOCK_USERS.map(u => ({ ...u, password: "password", email: `${u.id}@example.com` }));
}
// CHAT BOARD ENTITY: one DO instance per chat board, stores its own messages
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
// CONTACT ENTITY: For shareable DeltaChat invitation links
export interface Contact {
  id: string; // This will be the slug
  name: string;
  url: string;
}
export class ContactEntity extends IndexedEntity<Contact> {
  static readonly entityName = "contact";
  static readonly indexName = "contacts";
  static readonly initialState: Contact = { id: "", name: "", url: "" };
}