import { users, type User, type UpsertUser, clientRequests, type ClientRequest, type InsertClientRequest } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  createClientRequest(request: InsertClientRequest): Promise<ClientRequest>;
  getClientRequests(): Promise<ClientRequest[]>;
  getClientRequest(id: string): Promise<ClientRequest | undefined>;
  updateClientRequest(id: string, request: Partial<InsertClientRequest>): Promise<ClientRequest | undefined>;
  deleteClientRequest(id: string): Promise<void>;
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
}

export const storage = new DatabaseStorage();
