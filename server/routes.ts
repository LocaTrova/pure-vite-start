import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { formSubmissionSchema } from "@shared/schema";
import { appendToSheet, createSpreadsheetIfNeeded } from "./googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/submit-form", async (req, res) => {
    try {
      const validatedData = formSubmissionSchema.parse(req.body);
      
      const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
      if (!spreadsheetId) {
        return res.status(500).json({ 
          error: "Google Sheets ID non configurato. Configura la variabile GOOGLE_SHEETS_ID nelle impostazioni." 
        });
      }

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

  app.post("/api/setup-sheets", async (req, res) => {
    try {
      const spreadsheetId = await createSpreadsheetIfNeeded();
      
      res.json({ 
        success: true, 
        spreadsheetId,
        message: "Google Sheet creato con successo!"
      });
    } catch (error: any) {
      console.error("Errore nella creazione del Google Sheet:", error);
      res.status(500).json({ 
        error: "Errore nella creazione del foglio. Verifica che l'integrazione Google Sheets sia configurata correttamente." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
