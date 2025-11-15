import { users, type User, type UpsertUser, clientRequests, type ClientRequest, type InsertClientRequest, scopingCalls, type ScopingCall, type InsertScopingCall, coordinationCalls, type CoordinationCall, type InsertCoordinationCall, emailCommunications, type EmailCommunication, type InsertEmailCommunication } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  createClientRequest(request: InsertClientRequest): Promise<ClientRequest>;
  getClientRequests(): Promise<ClientRequest[]>;
  getClientRequest(id: string): Promise<ClientRequest | undefined>;
  updateClientRequest(id: string, request: Partial<InsertClientRequest>): Promise<ClientRequest | undefined>;
  deleteClientRequest(id: string): Promise<void>;
  
  createScopingCall(call: InsertScopingCall): Promise<ScopingCall>;
  getScopingCallsByRequest(clientRequestId: string): Promise<ScopingCall[]>;
  getScopingCall(id: string): Promise<ScopingCall | undefined>;
  updateScopingCall(id: string, call: Partial<InsertScopingCall>): Promise<ScopingCall | undefined>;
  deleteScopingCall(id: string): Promise<void>;
  
  createCoordinationCall(call: InsertCoordinationCall): Promise<CoordinationCall>;
  getCoordinationCallsByRequest(clientRequestId: string): Promise<CoordinationCall[]>;
  getCoordinationCall(id: string): Promise<CoordinationCall | undefined>;
  updateCoordinationCall(id: string, call: Partial<InsertCoordinationCall>): Promise<CoordinationCall | undefined>;
  deleteCoordinationCall(id: string): Promise<void>;
  
  createEmailCommunication(email: InsertEmailCommunication): Promise<EmailCommunication>;
  getEmailCommunicationsByRequest(clientRequestId: string): Promise<EmailCommunication[]>;
  getEmailCommunication(id: string): Promise<EmailCommunication | undefined>;
  findDuplicateEmail(clientRequestId: string, subject: string, sentDateTime: Date): Promise<EmailCommunication | undefined>;
  updateEmailCommunication(id: string, email: Partial<InsertEmailCommunication>): Promise<EmailCommunication | undefined>;
  deleteEmailCommunication(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createClientRequest(request: InsertClientRequest): Promise<ClientRequest> {
    const [newRequest] = await db
      .insert(clientRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getClientRequests(): Promise<ClientRequest[]> {
    return await db
      .select()
      .from(clientRequests)
      .orderBy(desc(clientRequests.createdAt));
  }

  async getClientRequest(id: string): Promise<ClientRequest | undefined> {
    const [request] = await db
      .select()
      .from(clientRequests)
      .where(eq(clientRequests.id, id));
    return request;
  }

  async updateClientRequest(id: string, request: Partial<InsertClientRequest>): Promise<ClientRequest | undefined> {
    const [updated] = await db
      .update(clientRequests)
      .set(request)
      .where(eq(clientRequests.id, id))
      .returning();
    return updated;
  }

  async deleteClientRequest(id: string): Promise<void> {
    await db
      .delete(clientRequests)
      .where(eq(clientRequests.id, id));
  }

  async createScopingCall(call: InsertScopingCall): Promise<ScopingCall> {
    const [newCall] = await db
      .insert(scopingCalls)
      .values(call)
      .returning();
    return newCall;
  }

  async getScopingCallsByRequest(clientRequestId: string): Promise<ScopingCall[]> {
    return await db
      .select()
      .from(scopingCalls)
      .where(eq(scopingCalls.clientRequestId, clientRequestId))
      .orderBy(desc(scopingCalls.createdAt));
  }

  async getScopingCall(id: string): Promise<ScopingCall | undefined> {
    const [call] = await db
      .select()
      .from(scopingCalls)
      .where(eq(scopingCalls.id, id));
    return call;
  }

  async updateScopingCall(id: string, call: Partial<InsertScopingCall>): Promise<ScopingCall | undefined> {
    const [updated] = await db
      .update(scopingCalls)
      .set({
        ...call,
        updatedAt: new Date(),
      })
      .where(eq(scopingCalls.id, id))
      .returning();
    return updated;
  }

  async deleteScopingCall(id: string): Promise<void> {
    await db
      .delete(scopingCalls)
      .where(eq(scopingCalls.id, id));
  }

  async createCoordinationCall(call: InsertCoordinationCall): Promise<CoordinationCall> {
    const [newCall] = await db
      .insert(coordinationCalls)
      .values(call)
      .returning();
    return newCall;
  }

  async getCoordinationCallsByRequest(clientRequestId: string): Promise<CoordinationCall[]> {
    return await db
      .select()
      .from(coordinationCalls)
      .where(eq(coordinationCalls.clientRequestId, clientRequestId))
      .orderBy(desc(coordinationCalls.createdAt));
  }

  async getCoordinationCall(id: string): Promise<CoordinationCall | undefined> {
    const [call] = await db
      .select()
      .from(coordinationCalls)
      .where(eq(coordinationCalls.id, id));
    return call;
  }

  async updateCoordinationCall(id: string, call: Partial<InsertCoordinationCall>): Promise<CoordinationCall | undefined> {
    const [updated] = await db
      .update(coordinationCalls)
      .set({
        ...call,
        updatedAt: new Date(),
      })
      .where(eq(coordinationCalls.id, id))
      .returning();
    return updated;
  }

  async deleteCoordinationCall(id: string): Promise<void> {
    await db
      .delete(coordinationCalls)
      .where(eq(coordinationCalls.id, id));
  }

  async createEmailCommunication(email: InsertEmailCommunication): Promise<EmailCommunication> {
    const [newEmail] = await db
      .insert(emailCommunications)
      .values(email)
      .returning();
    return newEmail;
  }

  async getEmailCommunicationsByRequest(clientRequestId: string): Promise<EmailCommunication[]> {
    return await db
      .select()
      .from(emailCommunications)
      .where(eq(emailCommunications.clientRequestId, clientRequestId))
      .orderBy(desc(emailCommunications.sentDateTime));
  }

  async getEmailCommunication(id: string): Promise<EmailCommunication | undefined> {
    const [email] = await db
      .select()
      .from(emailCommunications)
      .where(eq(emailCommunications.id, id));
    return email;
  }

  async findDuplicateEmail(clientRequestId: string, subject: string, sentDateTime: Date): Promise<EmailCommunication | undefined> {
    const [email] = await db
      .select()
      .from(emailCommunications)
      .where(
        and(
          eq(emailCommunications.clientRequestId, clientRequestId),
          eq(emailCommunications.subject, subject),
          eq(emailCommunications.sentDateTime, sentDateTime)
        )
      );
    return email;
  }

  async updateEmailCommunication(id: string, email: Partial<InsertEmailCommunication>): Promise<EmailCommunication | undefined> {
    const [updated] = await db
      .update(emailCommunications)
      .set({
        ...email,
        updatedAt: new Date(),
      })
      .where(eq(emailCommunications.id, id))
      .returning();
    return updated;
  }

  async deleteEmailCommunication(id: string): Promise<void> {
    await db
      .delete(emailCommunications)
      .where(eq(emailCommunications.id, id));
  }
}

export const storage = new DatabaseStorage();
