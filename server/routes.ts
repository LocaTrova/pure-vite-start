import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { formSubmissionSchema } from "@shared/schema";
import { appendToSheet } from "./googleSheets";
import { ResendMailingService } from "./services/ResendMailingService.tsx";
import { EmailTemplateRenderer } from "./services/EmailTemplateRenderer";

// Session tracking for abandonment deduplication
// IMPORTANT LIMITATION: This Map is stored in-memory and will be lost on server restart.
// After a deployment or server restart, the same sessionId could trigger duplicate emails.
// For production with high traffic, consider using Redis or a database for persistence.
// Current implementation is acceptable for low-traffic scenarios where occasional duplicates
// after deployment are tolerable.
const processedSessions = new Map<string, number>();

// Cleanup old sessions every hour
setInterval(() => {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  processedSessions.forEach((timestamp, sessionId) => {
    if (timestamp < oneDayAgo) {
      processedSessions.delete(sessionId);
    }
  });
}, 60 * 60 * 1000);

export async function registerRoutes(app: Express): Promise<Server> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  
  const mailingService = new ResendMailingService(apiKey, "onboarding@resend.dev");

  app.post("/api/send-welcome-email", async (req, res) => {
    try {
      const { email, name } = req.body;
      if (!email || !name) {
        return res.status(400).json({ error: "Email and name are required." });
      }

      const emailHtml = await EmailTemplateRenderer.renderWelcomeEmail(name);

      await mailingService.sendMail({
        to: email,
        subject: "Welcome to Locatrova!",
        html: emailHtml,
      });

      res.json({ success: true, message: "Welcome email sent successfully!" });
    } catch (error: any) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // Form abandonment endpoint
  app.post("/api/form-abandonment", async (req, res) => {
    try {
      const { sessionId, startedAt, partialData } = req.body;

      // Security: Check payload size to prevent DoS attacks
      const payloadSize = JSON.stringify(req.body).length;
      const MAX_PAYLOAD_SIZE = 50000; // 50KB limit
      
      if (payloadSize > MAX_PAYLOAD_SIZE) {
        console.warn(`Payload too large: ${payloadSize} bytes (max: ${MAX_PAYLOAD_SIZE})`);
        return res.status(413).json({ error: "Payload too large" });
      }

      // Validation
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: "sessionId is required" });
      }

      if (!partialData || typeof partialData !== 'object' || Object.keys(partialData).length === 0) {
        return res.status(400).json({ error: "partialData must contain at least one field" });
      }

      // Check if feature is enabled
      if (process.env.ENABLE_ABANDONMENT_TRACKING !== 'true') {
        console.log(`Abandonment tracking disabled - SessionId: ${sessionId}`);
        return res.json({ success: true, message: "Feature disabled" });
      }

      // Check for duplicate session (rate limiting)
      if (processedSessions.has(sessionId)) {
        console.log(`Duplicate abandonment session detected: ${sessionId}`);
        return res.json({ success: true, message: "Already processed" });
      }

      // Mark session as processed
      processedSessions.set(sessionId, Date.now());

      // Calculate completed and missing fields
      const allFields = ['spaceType', 'name', 'email', 'phone', 'city', 'squareMeters', 'availability', 'characteristics', 'notes'];
      const completedFields = allFields.filter(field => {
        const value = partialData[field];
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== undefined && value !== null && value !== '' && value !== 0;
      });
      const missingFields = allFields.filter(field => !completedFields.includes(field));

      const abandonedAt = new Date().toISOString();

      // Render and send email
      const emailHtml = await EmailTemplateRenderer.renderFormAbandonmentEmail({
        startedAt,
        abandonedAt,
        partialData,
        completedFields,
        missingFields,
      });

      const recipient = process.env.ABANDONMENT_EMAIL_RECIPIENT || "alessiopersichettidev@gmail.com";
      
      await mailingService.sendMail({
        to: recipient,
        subject: `Form abbandonato - ${sessionId.substring(0, 8)}`,
        html: emailHtml,
      });

      console.log(`Form abandonment email sent - SessionId: ${sessionId}, Fields filled: ${completedFields.length}`);

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error processing form abandonment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/submit-form", async (req, res) => {
    try {
      
      const validatedData = formSubmissionSchema.parse(req.body);

      // Send notification email
      const spaceTypeLabels: Record<string, string> = {
        house: "Casa/Appartamento",
        office: "Ufficio/Spazio commerciale",
        warehouse: "Spazio industriale/Warehouse",
        villa: "Villa/Casale storico",
        studio: "Studio/Spazio creativo",
        outdoor: "Spazio esterno/Giardino",
        events: "Sala eventi/Meeting room",
        unique: "Location unica/Particolare",
      };

      const notificationHtml = await EmailTemplateRenderer.renderNotificationEmail({
        ...validatedData,
        spaceType: spaceTypeLabels[validatedData.spaceType] || validatedData.spaceType,
        squareMeters: validatedData.squareMeters.toString(),
      });

      await mailingService.sendMail({
        to: "alessiopersichettidev@gmail.com",
        subject: "Nuova richiesta di informazioni",
        html: notificationHtml,
      });

      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
      if (!spreadsheetId) {
        return res.status(500).json({ 
          error: "Google Sheets ID non configurato. Configura la variabile GOOGLE_SHEETS_ID nelle impostazioni." 
        });
      }

      const timestamp = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
      const row = [
        timestamp,
        spaceTypeLabels[validatedData.spaceType] || validatedData.spaceType,
        validatedData.name,
        validatedData.email,
        validatedData.phone,
        validatedData.city,
        validatedData.squareMeters,
        validatedData.availability.join(", "),
        validatedData.characteristics || "",
        validatedData.notes || "",
        validatedData.marketing ? "Sì" : "No"
      ];

      try {
        await appendToSheet(spreadsheetId, row);
      } catch (sheetsError: any) {
        console.error("Errore Google Sheets:", sheetsError);
        return res.status(500).json({ 
          error: "Errore nel salvataggio dei dati. Verifica che il foglio Google Sheets sia configurato correttamente." 
        });
      }

      res.json({ success: true, message: "Richiesta inviata con successo!" });
    } catch (error: any) {
      console.error("Errore nell'invio del form:", error);
      
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          error: "Dati del form non validi. Controlla i campi e riprova." 
        });
      }
      
      res.status(500).json({ 
        error: "Errore interno del server. Riprova più tardi." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
