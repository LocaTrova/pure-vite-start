export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface IMailingService {
  sendMail(options: EmailOptions): Promise<void>;
}
