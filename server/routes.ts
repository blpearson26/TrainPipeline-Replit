import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertClientRequestSchema, insertScopingCallSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/client-requests', isAuthenticated, async (_req, res) => {
    try {
      const requests = await storage.getClientRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching client requests:", error);
      res.status(500).json({ message: "Failed to fetch client requests" });
    }
  });

  app.post('/api/client-requests', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertClientRequestSchema.parse(req.body);
      const newRequest = await storage.createClientRequest(validatedData);
      res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating client request:", error);
      res.status(400).json({ message: "Failed to create client request", error });
    }
  });

  app.get('/api/client-requests/:id', isAuthenticated, async (req, res) => {
    try {
      const request = await storage.getClientRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ message: "Client request not found" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error fetching client request:", error);
      res.status(500).json({ message: "Failed to fetch client request" });
    }
  });

  app.patch('/api/client-requests/:id', isAuthenticated, async (req, res) => {
    try {
      const partialData = insertClientRequestSchema.partial().parse(req.body);
      const updated = await storage.updateClientRequest(req.params.id, partialData);
      if (!updated) {
        return res.status(404).json({ message: "Client request not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating client request:", error);
      res.status(400).json({ message: "Failed to update client request", error });
    }
  });

  app.delete('/api/client-requests/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteClientRequest(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting client request:", error);
      res.status(500).json({ message: "Failed to delete client request" });
    }
  });

  app.get('/api/client-requests/:requestId/scoping-calls', isAuthenticated, async (req, res) => {
    try {
      const calls = await storage.getScopingCallsByRequest(req.params.requestId);
      res.json(calls);
    } catch (error) {
      console.error("Error fetching scoping calls:", error);
      res.status(500).json({ message: "Failed to fetch scoping calls" });
    }
  });

  app.post('/api/scoping-calls', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertScopingCallSchema.parse({
        ...req.body,
        createdBy: userId,
        lastModifiedBy: userId,
      });
      const newCall = await storage.createScopingCall(validatedData);
      res.status(201).json(newCall);
    } catch (error) {
      console.error("Error creating scoping call:", error);
      res.status(400).json({ message: "Failed to create scoping call", error });
    }
  });

  app.get('/api/scoping-calls/:id', isAuthenticated, async (req, res) => {
    try {
      const call = await storage.getScopingCall(req.params.id);
      if (!call) {
        return res.status(404).json({ message: "Scoping call not found" });
      }
      res.json(call);
    } catch (error) {
      console.error("Error fetching scoping call:", error);
      res.status(500).json({ message: "Failed to fetch scoping call" });
    }
  });

  app.patch('/api/scoping-calls/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partialData = insertScopingCallSchema.partial().parse({
        ...req.body,
        lastModifiedBy: userId,
      });
      const updated = await storage.updateScopingCall(req.params.id, partialData);
      if (!updated) {
        return res.status(404).json({ message: "Scoping call not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating scoping call:", error);
      res.status(400).json({ message: "Failed to update scoping call", error });
    }
  });

  app.delete('/api/scoping-calls/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteScopingCall(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting scoping call:", error);
      res.status(500).json({ message: "Failed to delete scoping call" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
