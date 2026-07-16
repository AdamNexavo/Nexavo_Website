export type MailTemplateId =
  | "account_invitation"
  | "intake_reminder"
  | "password_reset"
  | "intake_received"
  | "integration_requested"
  | "integration_requested_admin"
  | "ticket_received"
  | "ticket_replied"
  | "invoice_available"
  | "payment_reminder";

export type MailTemplateVars = {
  customerName?: string;
  companyName?: string;
  portalLink?: string;
  intakeLink?: string;
  resetLink?: string;
  invoiceNumber?: string;
  amount?: string;
  dueDate?: string;
  packageName?: string;
  integrationName?: string;
  ticketNumber?: string;
  openSteps?: string;
  adminLink?: string;
};

export type MailTemplate = {
  id: MailTemplateId;
  subject: string;
  description: string;
  render: (vars: MailTemplateVars) => { subject: string; html: string; text: string };
};

export type MailSendResult =
  | { ok: true; mode: "sent"; id?: string }
  | { ok: true; mode: "demo"; message: string }
  | { ok: false; error: string };

export type MailEvent =
  | { type: "account_invitation"; to: string; vars: MailTemplateVars }
  | { type: "intake_reminder"; to: string; vars: MailTemplateVars }
  | { type: "password_reset"; to: string; vars: MailTemplateVars }
  | { type: "intake_received"; to: string; vars: MailTemplateVars }
  | { type: "integration_requested"; to: string; vars: MailTemplateVars }
  | { type: "integration_requested_admin"; to: string; vars: MailTemplateVars }
  | { type: "ticket_received"; to: string; vars: MailTemplateVars }
  | { type: "ticket_replied"; to: string; vars: MailTemplateVars }
  | { type: "invoice_available"; to: string; vars: MailTemplateVars }
  | { type: "payment_reminder"; to: string; vars: MailTemplateVars };
