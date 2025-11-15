import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (Required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (Required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clientRequests = pgTable("client_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  pointOfContact: text("point_of_contact").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  initialTopicRequests: text("initial_topic_requests").notNull(),
  numberOfAttendees: integer("number_of_attendees").notNull(),
  mode: text("mode").notNull(),
  scopingCallDate: timestamp("scoping_call_date").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scopingCalls = pgTable("scoping_calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientRequestId: varchar("client_request_id").notNull(),
  attendeeRoles: text("attendee_roles").notNull(),
  trainingObjectives: text("training_objectives").notNull(),
  deliveryMode: text("delivery_mode").notNull(),
  duration: text("duration").notNull(),
  preferredTimeWindow: text("preferred_time_window").notNull(),
  numberOfParticipants: integer("number_of_participants").notNull(),
  specialRequirements: text("special_requirements"),
  notes: text("notes"),
  status: text("status").notNull().default("draft"),
  createdBy: varchar("created_by").notNull(),
  lastModifiedBy: varchar("last_modified_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const coordinationCalls = pgTable("coordination_calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientRequestId: varchar("client_request_id").notNull(),
  callDateTime: timestamp("call_date_time").notNull(),
  purpose: text("purpose").notNull(),
  summaryOfDiscussion: text("summary_of_discussion").notNull(),
  attendeeRoles: text("attendee_roles"),
  updatedObjectives: text("updated_objectives"),
  additionalMaterials: text("additional_materials"),
  deliveryChanges: text("delivery_changes"),
  followUpActions: text("follow_up_actions"),
  notes: text("notes"),
  status: text("status").notNull().default("draft"),
  createdBy: varchar("created_by").notNull(),
  lastModifiedBy: varchar("last_modified_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emailCommunications = pgTable("email_communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientRequestId: varchar("client_request_id").notNull(),
  senderName: text("sender_name").notNull(),
  senderEmail: text("sender_email").notNull(),
  recipients: text("recipients").notNull(),
  sentDateTime: timestamp("sent_date_time").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  attachments: jsonb("attachments"),
  threadId: text("thread_id"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const proposalDocuments = pgTable("proposal_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientRequestId: varchar("client_request_id").notNull(),
  documentType: text("document_type").notNull(),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  externalLink: text("external_link"),
  versionLabel: text("version_label").notNull(),
  notes: text("notes"),
  status: text("status"),
  signatureDate: timestamp("signature_date"),
  isCurrentVersion: integer("is_current_version").notNull().default(0),
  uploadedBy: varchar("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  industry: text("industry"),
  trainingNeeds: text("training_needs"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  totalAmount: integer("total_amount"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const trainingSessions = pgTable("training_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  clientName: text("client_name").notNull(),
  proposalId: varchar("proposal_id"),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  deliveryMode: text("delivery_mode").notNull(),
  location: text("location"),
  virtualLink: text("virtual_link"),
  instructor: text("instructor").notNull(),
  facilitators: text("facilitators").array(),
  status: text("status").notNull().default("tentative"),
  participantCount: integer("participant_count"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const curriculumItems = pgTable("curriculum_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  objectives: jsonb("objectives"),
  duration: integer("duration"),
  materials: jsonb("materials"),
});

export const evaluations = pgTable("evaluations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  participantName: text("participant_name"),
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  proposalId: varchar("proposal_id"),
  invoiceNumber: text("invoice_number").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertClientRequestSchema = createInsertSchema(clientRequests).omit({ id: true, createdAt: true }).extend({
  scopingCallDate: z.coerce.date(),
});
export const insertScopingCallSchema = createInsertSchema(scopingCalls).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCoordinationCallSchema = createInsertSchema(coordinationCalls).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  callDateTime: z.coerce.date(),
});
export const insertEmailCommunicationSchema = createInsertSchema(emailCommunications).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  sentDateTime: z.coerce.date(),
});
export const insertProposalDocumentSchema = createInsertSchema(proposalDocuments).omit({ id: true, uploadedAt: true });
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true });
export const insertProposalSchema = createInsertSchema(proposals).omit({ id: true, createdAt: true, approvedAt: true });
export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
export const insertCurriculumItemSchema = createInsertSchema(curriculumItems).omit({ id: true });
export const insertEvaluationSchema = createInsertSchema(evaluations).omit({ id: true, submittedAt: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true, paidAt: true });

export type ClientRequest = typeof clientRequests.$inferSelect;
export type InsertClientRequest = z.infer<typeof insertClientRequestSchema>;
export type ScopingCall = typeof scopingCalls.$inferSelect;
export type InsertScopingCall = z.infer<typeof insertScopingCallSchema>;
export type CoordinationCall = typeof coordinationCalls.$inferSelect;
export type InsertCoordinationCall = z.infer<typeof insertCoordinationCallSchema>;
export type EmailCommunication = typeof emailCommunications.$inferSelect;
export type InsertEmailCommunication = z.infer<typeof insertEmailCommunicationSchema>;
export type ProposalDocument = typeof proposalDocuments.$inferSelect;
export type InsertProposalDocument = z.infer<typeof insertProposalDocumentSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type CurriculumItem = typeof curriculumItems.$inferSelect;
export type InsertCurriculumItem = z.infer<typeof insertCurriculumItemSchema>;
export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = z.infer<typeof insertEvaluationSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
