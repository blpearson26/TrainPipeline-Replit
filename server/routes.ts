import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertClientRequestSchema, insertScopingCallSchema, insertCoordinationCallSchema, insertEmailCommunicationSchema, insertProposalDocumentSchema } from "@shared/schema";
import { generatePresignedUploadUrl, generatePresignedDownloadUrl } from "./objectStorage";

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

  app.get('/api/client-requests/:requestId/coordination-calls', isAuthenticated, async (req, res) => {
    try {
      const calls = await storage.getCoordinationCallsByRequest(req.params.requestId);
      res.json(calls);
    } catch (error) {
      console.error("Error fetching coordination calls:", error);
      res.status(500).json({ message: "Failed to fetch coordination calls" });
    }
  });

  app.post('/api/coordination-calls', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCoordinationCallSchema.parse({
        ...req.body,
        createdBy: userId,
        lastModifiedBy: userId,
      });
      const newCall = await storage.createCoordinationCall(validatedData);
      res.status(201).json(newCall);
    } catch (error) {
      console.error("Error creating coordination call:", error);
      res.status(400).json({ message: "Failed to create coordination call", error });
    }
  });

  app.get('/api/coordination-calls/:id', isAuthenticated, async (req, res) => {
    try {
      const call = await storage.getCoordinationCall(req.params.id);
      if (!call) {
        return res.status(404).json({ message: "Coordination call not found" });
      }
      res.json(call);
    } catch (error) {
      console.error("Error fetching coordination call:", error);
      res.status(500).json({ message: "Failed to fetch coordination call" });
    }
  });

  app.patch('/api/coordination-calls/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const partialData = insertCoordinationCallSchema.partial().parse({
        ...req.body,
        lastModifiedBy: userId,
      });
      const updated = await storage.updateCoordinationCall(req.params.id, partialData);
      if (!updated) {
        return res.status(404).json({ message: "Coordination call not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating coordination call:", error);
      res.status(400).json({ message: "Failed to update coordination call", error });
    }
  });

  app.delete('/api/coordination-calls/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteCoordinationCall(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting coordination call:", error);
      res.status(500).json({ message: "Failed to delete coordination call" });
    }
  });

  app.get('/api/client-requests/:requestId/email-communications', isAuthenticated, async (req, res) => {
    try {
      const emails = await storage.getEmailCommunicationsByRequest(req.params.requestId);
      res.json(emails);
    } catch (error) {
      console.error("Error fetching email communications:", error);
      res.status(500).json({ message: "Failed to fetch email communications" });
    }
  });

  app.post('/api/email-communications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEmailCommunicationSchema.parse({
        ...req.body,
        createdBy: userId,
      });

      const duplicate = await storage.findDuplicateEmail(
        validatedData.clientRequestId,
        validatedData.subject,
        validatedData.sentDateTime
      );

      if (duplicate) {
        return res.status(409).json({ 
          message: "Email already logged",
          existingEmail: duplicate 
        });
      }

      const newEmail = await storage.createEmailCommunication(validatedData);
      res.status(201).json(newEmail);
    } catch (error) {
      console.error("Error creating email communication:", error);
      res.status(400).json({ message: "Failed to create email communication", error });
    }
  });

  app.get('/api/email-communications/:id', isAuthenticated, async (req, res) => {
    try {
      const email = await storage.getEmailCommunication(req.params.id);
      if (!email) {
        return res.status(404).json({ message: "Email communication not found" });
      }
      res.json(email);
    } catch (error) {
      console.error("Error fetching email communication:", error);
      res.status(500).json({ message: "Failed to fetch email communication" });
    }
  });

  app.patch('/api/email-communications/:id', isAuthenticated, async (req, res) => {
    try {
      const partialData = insertEmailCommunicationSchema.partial().parse(req.body);
      const updated = await storage.updateEmailCommunication(req.params.id, partialData);
      if (!updated) {
        return res.status(404).json({ message: "Email communication not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating email communication:", error);
      res.status(400).json({ message: "Failed to update email communication", error });
    }
  });

  app.delete('/api/email-communications/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteEmailCommunication(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting email communication:", error);
      res.status(500).json({ message: "Failed to delete email communication" });
    }
  });

  app.post('/api/object-storage/generate-upload-url', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { fileName, contentType } = req.body;

      if (!fileName || !contentType) {
        return res.status(400).json({ message: "fileName and contentType are required" });
      }

      const { uploadUrl, fileUrl } = await generatePresignedUploadUrl({
        fileName,
        contentType,
        userId,
      });

      res.json({ uploadUrl, fileUrl });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ message: "Failed to generate upload URL", error });
    }
  });

  app.post('/api/object-storage/generate-download-url', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { fileUrl } = req.body;

      if (!fileUrl) {
        return res.status(400).json({ message: "fileUrl is required" });
      }

      const downloadUrl = await generatePresignedDownloadUrl({
        fileUrl,
        userId,
      });

      res.json({ downloadUrl });
    } catch (error) {
      console.error("Error generating download URL:", error);
      res.status(500).json({ message: "Failed to generate download URL", error });
    }
  });

  app.get('/api/proposal-documents', isAuthenticated, async (req, res) => {
    try {
      const { clientRequestId } = req.query;
      if (!clientRequestId || typeof clientRequestId !== 'string') {
        return res.status(400).json({ message: "clientRequestId is required" });
      }
      const documents = await storage.getProposalDocumentsByRequest(clientRequestId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching proposal documents:", error);
      res.status(500).json({ message: "Failed to fetch proposal documents" });
    }
  });

  app.post('/api/proposal-documents', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProposalDocumentSchema.parse({
        ...req.body,
        uploadedBy: userId,
      });
      const newDocument = await storage.createProposalDocument(validatedData);
      res.status(201).json(newDocument);
    } catch (error) {
      console.error("Error creating proposal document:", error);
      res.status(400).json({ message: "Failed to create proposal document", error });
    }
  });

  app.get('/api/proposal-documents/:id', isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getProposalDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Proposal document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error("Error fetching proposal document:", error);
      res.status(500).json({ message: "Failed to fetch proposal document" });
    }
  });

  app.patch('/api/proposal-documents/:id', isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getProposalDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Proposal document not found" });
      }

      if (document.status === "signed") {
        return res.status(403).json({ message: "Cannot modify a signed document" });
      }

      const partialData = insertProposalDocumentSchema.partial().parse(req.body);

      if (partialData.status === "signed") {
        const existingSignedDocs = await storage.getProposalDocumentsByRequest(document.clientRequestId);
        const hasSignedDoc = existingSignedDocs.some(
          (doc) => doc.status === "signed" && doc.id !== req.params.id
        );
        
        if (hasSignedDoc) {
          return res.status(400).json({ 
            message: "Only one document can be marked as signed per engagement" 
          });
        }

        if (!partialData.signatureDate) {
          partialData.signatureDate = new Date();
        }
      }

      const updated = await storage.updateProposalDocument(req.params.id, partialData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating proposal document:", error);
      res.status(400).json({ message: "Failed to update proposal document", error });
    }
  });

  app.post('/api/proposal-documents/:id/mark-current', isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getProposalDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Proposal document not found" });
      }
      await storage.markDocumentAsCurrent(document.clientRequestId, req.params.id);
      const updated = await storage.getProposalDocument(req.params.id);
      res.json(updated);
    } catch (error) {
      console.error("Error marking document as current:", error);
      res.status(500).json({ message: "Failed to mark document as current", error });
    }
  });

  app.delete('/api/proposal-documents/:id', isAuthenticated, async (req, res) => {
    try {
      const document = await storage.getProposalDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Proposal document not found" });
      }

      if (document.status === "signed") {
        return res.status(403).json({ message: "Cannot delete a signed document" });
      }

      await storage.deleteProposalDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting proposal document:", error);
      res.status(500).json({ message: "Failed to delete proposal document" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
