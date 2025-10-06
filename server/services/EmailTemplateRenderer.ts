import { render } from "@react-email/render";
import { ReactElement } from "react";
import WelcomeEmail from "../emails/WelcomeEmail";
import NotificationEmail from "../emails/NotificationEmail";
import FormAbandonmentEmail from "../emails/FormAbandonmentEmail";

export class EmailTemplateRenderer {
  /**
   * Renders a React email component to HTML string
   * @param component - React email component to render
   * @returns HTML string
   */
  static async render(component: ReactElement): Promise<string> {
    return await render(component);
  }

  /**
   * Renders the welcome email template
   * @param name - Recipient name
   * @returns HTML string
   */
  static async renderWelcomeEmail(name: string): Promise<string> {
    return await render(WelcomeEmail({ name }));
  }

  /**
   * Renders the notification email template for form submissions
   * @param formData - Form submission data
   * @returns HTML string
   */
  static async renderNotificationEmail(formData: {
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
  }): Promise<string> {
    return await render(NotificationEmail({ formData }));
  }

  /**
   * Renders the form abandonment email template
   * @param data - Abandonment data including partial form data
   * @returns HTML string
   */
  static async renderFormAbandonmentEmail(data: {
    startedAt: string;
    abandonedAt: string;
    partialData: Record<string, any>;
    completedFields: string[];
    missingFields: string[];
  }): Promise<string> {
    return await render(FormAbandonmentEmail(data));
  }
}
