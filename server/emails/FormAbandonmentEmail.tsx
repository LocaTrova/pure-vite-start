import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface AbandonmentData {
  startedAt: string;
  abandonedAt: string;
  partialData: Record<string, any>;
  completedFields: string[];
  missingFields: string[];
}

export default function FormAbandonmentEmail({
  startedAt,
  abandonedAt,
  partialData,
  completedFields,
  missingFields,
}: AbandonmentData) {
  // Security: Escape HTML to prevent XSS attacks
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString("it-IT", {
        timeZone: "Europe/Rome",
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch (error) {
      return "Data non valida";
    }
  };

  const fieldLabels: Record<string, string> = {
    spaceType: "Tipo di Spazio",
    name: "Nome",
    email: "Email",
    phone: "Telefono",
    city: "Città",
    squareMeters: "Metri Quadrati",
    availability: "Disponibilità",
    characteristics: "Caratteristiche",
    notes: "Note",
  };

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

  const formatValue = (field: string, value: any): string => {
    if (value === null || value === undefined) {
      return "-";
    }
    
    if (field === 'spaceType') {
      const label = spaceTypeLabels[value];
      return escapeHtml(label || String(value));
    }
    
    if (Array.isArray(value)) {
      // Filter out empty values and escape each item
      const filtered = value.filter(v => v !== null && v !== undefined && v !== "");
      return filtered.map(v => escapeHtml(String(v))).join(", ") || "-";
    }
    
    return escapeHtml(String(value));
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>⚠️ Form Abbandonato</Heading>
          
          <Text style={text}>
            Un utente ha iniziato a compilare il form ma non ha completato l'invio.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Iniziato:</strong> {formatDate(startedAt)}
            </Text>
            <Text style={infoText}>
              <strong>Abbandonato:</strong> {formatDate(abandonedAt)}
            </Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            ✅ Campi Compilati ({completedFields.length})
          </Heading>
          
          {completedFields.length > 0 ? (
            <Section style={dataSection}>
              {completedFields.map((field) => (
                <div key={field} style={dataRow}>
                  <Text style={dataLabel}>{fieldLabels[field] || field}:</Text>
                  <Text style={dataValue}>
                    {formatValue(field, partialData[field])}
                  </Text>
                </div>
              ))}
            </Section>
          ) : (
            <Text style={text}>Nessun campo compilato</Text>
          )}

          <Hr style={hr} />

          <Heading as="h2" style={h2}>
            ❌ Campi Mancanti ({missingFields.length})
          </Heading>
          
          <Section style={missingSection}>
            {missingFields.map((field) => (
              <Text key={field} style={missingField}>
                • {fieldLabels[field] || field}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Considera di contattare l'utente per capire cosa ha causato l'abbandono del form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#e63946",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  margin: "20px 0 10px",
  padding: "0 40px",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px",
  padding: "0 40px",
};

const infoBox = {
  backgroundColor: "#f8f9fa",
  padding: "16px 40px",
  margin: "20px 0",
};

const infoText = {
  color: "#525f7f",
  fontSize: "14px",
  margin: "4px 0",
};

const dataSection = {
  padding: "0 40px",
};

const dataRow = {
  marginBottom: "12px",
};

const dataLabel = {
  color: "#1d3557",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px",
};

const dataValue = {
  color: "#525f7f",
  fontSize: "14px",
  margin: "0",
  padding: "8px",
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
};

const missingSection = {
  padding: "0 40px",
};

const missingField = {
  color: "#e63946",
  fontSize: "14px",
  margin: "4px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "20px 0 0",
  padding: "0 40px",
};
