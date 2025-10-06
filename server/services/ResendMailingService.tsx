import { Resend } from "resend";
import { IMailingService, EmailOptions } from "./IMailingService";

export class ResendMailingService implements IMailingService {
  private resend: Resend;
  private defaultFrom: string;

  constructor(apiKey: string, defaultFrom: string = "onboarding@resend.dev") {
    this.resend = new Resend(apiKey);
    this.defaultFrom = defaultFrom;
  }

  async sendMail(options: EmailOptions): Promise<void> {
    await this.resend.emails.send({
      from: options.from || this.defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
