import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NotificationEmailProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    spaceType: string;
    squareMeters: string;
    availability: string[];
    characteristics?: string;
    notes?: string;
    marketing: boolean;
  };
}

export const NotificationEmail = ({ formData }: NotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Nuova richiesta di informazioni da {formData.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>Nuova richiesta di informazioni</Text>
        
        <Section style={section}>
          <Text style={label}>Nome:</Text>
          <Text style={value}>{formData.name}</Text>
        </Section>
        
        <Section style={section}>
          <Text style={label}>Email:</Text>
          <Text style={value}>{formData.email}</Text>
        </Section>
        
        <Section style={section}>
          <Text style={label}>Telefono:</Text>
          <Text style={value}>{formData.phone}</Text>
        </Section>
        
        <Section style={section}>
          <Text style={label}>Città:</Text>
          <Text style={value}>{formData.city}</Text>
        </Section>
        
        <Section style={section}>
          <Text style={label}>Tipo di spazio:</Text>
          <Text style={value}>{formData.spaceType}</Text>
        </Section>
        
        <Section style={section}>
          <Text style={label}>Metri quadrati:</Text>
          <Text style={value}>{formData.squareMeters}</Text>
        </Section>
        
        <Section style={section}>
          <Text style={label}>Disponibilità:</Text>
          <Text style={value}>{formData.availability.join(", ")}</Text>
        </Section>
        
        {formData.characteristics && (
          <Section style={section}>
            <Text style={label}>Caratteristiche:</Text>
            <Text style={value}>{formData.characteristics}</Text>
          </Section>
        )}
        
        {formData.notes && (
          <Section style={section}>
            <Text style={label}>Note:</Text>
            <Text style={value}>{formData.notes}</Text>
          </Section>
        )}
        
        <Section style={section}>
          <Text style={label}>Marketing:</Text>
          <Text style={value}>{formData.marketing ? "Sì" : "No"}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default NotificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "600",
  color: "#484848",
  padding: "17px 0 0",
  margin: "0 24px",
};

const section = {
  padding: "0 24px",
  marginTop: "16px",
};

const label = {
  fontSize: "12px",
  lineHeight: "1.4",
  color: "#6a737d",
  fontWeight: "600",
  margin: "0 0 4px",
};

const value = {
  fontSize: "14px",
  lineHeight: "1.4",
  color: "#484848",
  margin: "0 0 16px",
};
