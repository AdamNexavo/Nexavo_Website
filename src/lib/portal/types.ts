import { BUILD_PROGRESS_STEPS } from "./constants";
import { normalizeWebsiteReferences, createDefaultWebsiteReferences } from "./references";
import type { IntegrationStatus, TicketStatusKey } from "./constants";
import { generateId } from "./storage";

export type PaymentStatus = "paid" | "pending" | "open" | "overdue" | "concept" | "processing";
export type PaymentBillingType = "one_time" | "recurring";
export type ClientPhase = "build" | "live";

export type OnboardingStepId =
  | "company"
  | "wishes"
  | "media"
  | "integrations"
  | "billing"
  | "payment"
  | "review";

export interface PortalUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarInitials?: string;
  logoDataUrl?: string;
}

export interface CompanyProfile {
  name: string;
  industry: string;
  location: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  existingWebsite?: string;
  /** Gewenste domeinnaam voor de nieuwe website */
  desiredDomain?: string;
  targetAudience: string;
  description?: string;
  /** Vrij verhaal — vertel alles over je bedrijf */
  aboutCompany?: string;
}

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface DayOpeningHours {
  closed?: boolean;
  /** Altijd open (24/7) */
  alwaysOpen?: boolean;
  open?: string;
  close?: string;
}

export interface OpeningHours {
  /** standard = ma-vr 09-17, custom = per dag, other = vrije tekst */
  scheduleType: "standard" | "custom" | "other";
  days: Partial<Record<WeekdayKey, DayOpeningHours>>;
  otherNote?: string;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  extra?: string;
  palette: string[];
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface AutomationDetails {
  booking?: {
    existingTool?: string;
    toolName?: string;
    reminders?: boolean;
    linkReviews?: boolean;
  };
  reviews?: {
    sendMoment?: string;
    channel?: string;
    internalNegative?: boolean;
    showOnWebsite?: boolean;
  };
  chatbot?: {
    commonQuestions?: string;
    referTo?: string;
    knowledge?: string;
  };
}

export interface WebsiteReference {
  url: string;
  note: string;
}

export interface OnboardingData {
  currentStep: OnboardingStepId;
  completedSteps: OnboardingStepId[];
  completed: boolean;
  submittedAt?: string;
  company: CompanyProfile;
  goals: string[];
  desiredPages: string[];
  customPages?: string;
  toneOfVoice?: string;
  integrations: string[];
  automationDetails: AutomationDetails;
  colors: BrandColors;
  stylePreference?: string;
  media: MediaFile[];
  referenceWebsites: string[];
  /** Referentiewebsites met URL + toelichting per site */
  websiteReferences?: WebsiteReference[];
  referenceNotes?: string;
  notes: string;
  openingHours?: OpeningHours;
  /** Klant bevestigt dat media is aangeleverd (upload of grote bestanden per e-mail) */
  mediaDelivered?: boolean;
  /** Grote bestanden: verstuurd per e-mail of niet van toepassing */
  largeFilesStatus?: "sent" | "not_applicable";
  /** @deprecated gebruik largeFilesStatus */
  largeFilesSubmitted?: boolean;
  /** Algemene voorwaarden geaccepteerd */
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  /** Klant heeft de betalingsstap bereikt (openstaande betaling mag pas dan) */
  paymentStepReached?: boolean;
  /** Toelichting per gewenste sectie */
  sectionNotes?: string;
}

export interface IntegrationRequest {
  id: string;
  integrationId: string;
  name: string;
  note?: string;
  requestedAt: string;
  status: IntegrationRequestStatus;
  internalNote?: string;
}

export type IntegrationRequestStatus = "new" | "in_progress" | "completed" | "rejected";

export type PreviewWebsiteStatus = "concept" | "ready" | "feedback_requested" | "approved";

export interface ClientPreviewSettings {
  enabled: boolean;
  url?: string;
  title?: string;
  description?: string;
  status?: PreviewWebsiteStatus;
}

export type PixelType = "meta" | "tiktok" | "google_ads" | "google_analytics" | "other";

export interface TechnicalSetupChecklist {
  intakeReceived?: boolean;
  previewCreated?: boolean;
  domainLinked?: boolean;
  dnsChecked?: boolean;
  sslActive?: boolean;
  formsTested?: boolean;
  integrationsChecked?: boolean;
  pixelAdded?: boolean;
  reviewFlowChecked?: boolean;
  bookingFlowChecked?: boolean;
  technicallyComplete?: boolean;
}

export interface ProjectProgress {
  percent: number;
  phase: string;
  steps: { label: string; done: boolean }[];
  previewUrl?: string;
  liveUrl?: string;
  lastUpdate?: string;
}

export interface PackageInfo {
  planId: string;
  planName: string;
  planPrice?: string;
  maintenanceId?: string;
  maintenanceName?: string;
  monthlyPrice: string;
  maintenanceIncluded: string[];
  startDate?: string;
  /** Geen pakket gekozen bij registratie — klant moet zelf kiezen */
  pendingSelection?: boolean;
  /** Maatwerk bevestigd door klant; Nexavo rondt intake-pakketstap af in admin */
  maatwerkPending?: boolean;
  /** Gekozen add-ons tijdens pakket-checkout */
  selectedAddons?: string[];
  /** Optionele voorkeuren bij maatwerk (pagina's, koppelingen, add-ons) */
  maatwerkWishlist?: MaatwerkWishlist;
}

export interface MaatwerkWishlist {
  pages: string[];
  integrations: string[];
  addons: string[];
}

export interface PaymentLine {
  id: string;
  description: string;
  type: "package" | "maintenance" | "addon" | "discount" | "subtotal" | "vat" | "total" | string;
  quantity?: number;
  unit?: string;
  unitPriceExVat?: number;
  vatRate?: number;
  totalExVat?: number;
  vatAmount?: number;
  totalIncVat?: number;
}

export interface PaymentRecord {
  id: string;
  /** Officieel factuurnummer, bijv. NX-2026-00001 */
  invoiceNumber?: string;
  description: string;
  packageName?: string;
  amount: string;
  amountExVat?: string;
  vatAmount?: string;
  amountIncVat?: string;
  status: PaymentStatus;
  /** Eenmalig (pakket) of periodiek (onderhoud) */
  billingType?: PaymentBillingType;
  paymentTermDays?: number;
  dueDate: string;
  issuedAt?: string;
  createdAt?: string;
  paidAt?: string;
  paymentMethod?: string;
  lines?: PaymentLine[];
  /** HTML-factuur (demo); later Mollie PDF-URL */
  pdfDataUrl?: string;
  pdfUrl?: string;
  molliePaymentId?: string;
  mollieCheckoutUrl?: string;
}

export interface TicketAttachment {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

export interface TicketMessage {
  id: string;
  author: "client" | "support";
  authorName: string;
  body: string;
  attachments: TicketAttachment[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  number: string;
  subject: string;
  status: TicketStatusKey;
  category: string;
  priority?: "normal" | "high";
  colorNotes?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface TermsAcceptanceAudit {
  acceptedAt: string;
  ipAddress?: string;
  userAgent?: string;
  customerName?: string;
  companyName?: string;
  email?: string;
  version?: string;
  snapshotText?: string;
  source?: "registration" | "intake" | "payment";
  checkboxText?: string;
  acceptedByName?: string;
  documentId?: string;
}

export type ClientDocumentCategory =
  | "logo"
  | "image"
  | "video"
  | "pdf"
  | "file"
  | "intake"
  | "generated"
  | "other";

export type ClientDocumentStatus = "active" | "archived" | "replaced";

export interface ClientDocument {
  id: string;
  customerId: string;
  name: string;
  type: string;
  category: ClientDocumentCategory;
  size?: number;
  uploadedAt: string;
  uploadedBy: "client" | "admin" | "system";
  url?: string;
  dataUrl?: string;
  status: ClientDocumentStatus;
  notes?: string;
  source?: "onboarding" | "admin" | "generated" | "assigned";
}

export interface ProjectProgressSettings {
  manualPercent?: number;
  manualPhase?: string;
  manualOverrideEnabled?: boolean;
  internalNote?: string;
}

export interface DocumentAttachment {
  fileName: string;
  mimeType: string;
  dataUrl: string;
  size?: number;
}

export type ClientWebsiteStatus = "draft" | "preview" | "live" | "archived";

export interface ClientWebsite {
  id: string;
  name: string;
  url?: string;
  previewUrl?: string;
  status: ClientWebsiteStatus;
  isPrimary?: boolean;
  createdAt: string;
}

export type DomainOwnership = "client" | "nexavo";
export type DnsManagedBy = "client" | "nexavo" | "provider";

export interface ClientTechnicalSetup {
  /** Admin heeft technische setup afgerond */
  completed?: boolean;
  checklist?: TechnicalSetupChecklist;
  hostingProvider?: string;
  hostingProviderLabel?: string;
  providerLoginUrl?: string;
  domainOwnership?: DomainOwnership;
  domainName?: string;
  dnsManagedBy?: DnsManagedBy;
  nameservers?: string;
  aRecord?: string;
  cnameRecord?: string;
  txtRecords?: string;
  sslProvider?: string;
  cmsPlatform?: string;
  pixelInstalled?: boolean;
  pixelType?: PixelType;
  pixelId?: string;
  pixelNotes?: string;
  internalNotes?: string;
  updatedAt?: string;
}

export interface ClientAssignedDocument {
  id: string;
  title: string;
  description?: string;
  href?: string;
  external?: boolean;
  content?: string;
  attachment?: DocumentAttachment;
  assignedAt: string;
  assignedBy?: string;
}

export interface ClientAccount {
  id: string;
  /** Stabiel klantnummer (NX-XXXXXXXX), identiek overal in het portaal */
  clientNumber?: string;
  email: string;
  passwordHash: string;
  user: PortalUser;
  companyName: string;
  createdAt: string;
  invitedBy?: string;
  phase: ClientPhase;
  onboarding: OnboardingData;
  package: PackageInfo;
  progress: ProjectProgress;
  payments: PaymentRecord[];
  tickets: SupportTicket[];
  integrationStatuses?: Record<string, IntegrationStatus>;
  integrationRequests?: IntegrationRequest[];
  billingInfo?: {
    companyName?: string;
    kvk?: string;
    btw?: string;
    address?: string;
    city?: string;
    email?: string;
    postcode?: string;
    houseNumber?: string;
    addition?: string;
    accountHolderFirstName?: string;
    accountHolderLastName?: string;
  };
  websiteUrl?: string;
  /** Gekoppelde websites (primair + extra); legacy websiteUrl wordt gemigreerd */
  websites?: ClientWebsite[];
  /** Verplichte technische setup door admin (hosting, DNS, provider) */
  technicalSetup?: ClientTechnicalSetup;
  /** Audit trail wanneer algemene voorwaarden geaccepteerd zijn */
  termsAcceptance?: TermsAcceptanceAudit;
  /** Door admin toegevoegde documenten zichtbaar in klantportaal */
  assignedDocuments?: ClientAssignedDocument[];
  /** Handmatige preview-instellingen voor klantportaal */
  previewSettings?: ClientPreviewSettings;
  /** Alle documenten/media per klant (uploads + gegenereerd) */
  clientDocuments?: ClientDocument[];
  /** Handmatige voortgang-instellingen door admin */
  progressSettings?: ProjectProgressSettings;
  /** Admin: pakket definitief — klant kan niet zelf wijzigen */
  packageLocked?: boolean;
  /** Betaaltermijn in dagen — standaard 14, instelbaar door admin per klant */
  paymentTermDays?: number;
  active: boolean;
}

export interface ClientInvite {
  id: string;
  email: string;
  companyName: string;
  planId: string;
  planName: string;
  maintenanceId?: string;
  maintenanceName?: string;
  /** Klant kiest zelf pakket in portaal na registratie */
  noPackage?: boolean;
  token: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  usedAt?: string;
}

export type SessionType = "client" | "admin";

export interface PortalSession {
  type: SessionType;
  clientId?: string;
  email: string;
  loggedInAt: string;
}

export const ONBOARDING_STEPS: { id: OnboardingStepId; label: string; shortLabel: string }[] = [
  { id: "company", label: "Bedrijfsgegevens", shortLabel: "Bedrijf" },
  { id: "wishes", label: "Wensen & doelen", shortLabel: "Wensen" },
  { id: "media", label: "Media & huisstijl", shortLabel: "Huisstijl" },
  { id: "integrations", label: "Koppelingen", shortLabel: "Koppelingen" },
  { id: "billing", label: "Facturatie & voorwaarden", shortLabel: "Facturatie" },
  { id: "payment", label: "Betalen & versturen", shortLabel: "Betalen" },
];

export function createDefaultOpeningHours(): OpeningHours {
  const days: OpeningHours["days"] = {};
  (["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as WeekdayKey[]).forEach((key) => {
    days[key] = {
      open: key === "sat" || key === "sun" ? undefined : "09:00",
      close: key === "sat" || key === "sun" ? undefined : "17:00",
      closed: key === "sat" || key === "sun",
    };
  });
  return { scheduleType: "custom", days };
}

export function createDefaultOnboarding(partial?: Partial<OnboardingData>): OnboardingData {
  return {
    currentStep: "company",
    completedSteps: [],
    completed: false,
    company: {
      name: "",
      industry: "",
      location: "",
      contactPerson: "",
      targetAudience: "",
    },
    goals: [],
    desiredPages: [],
    integrations: [],
    automationDetails: {},
    colors: {
      primary: "#7547F8",
      secondary: "#0B0B0D",
      accent: "#7547F8",
      palette: ["#7547F8", "#0B0B0D", "#F5F4F2", "#FAFAFA", "#FFFFFF"],
    },
    media: [],
    referenceWebsites: [],
    websiteReferences: createDefaultWebsiteReferences(),
    notes: "",
    openingHours: createDefaultOpeningHours(),
    ...partial,
  };
}

export function createDefaultProgress(): ProjectProgress {
  return {
    percent: 10,
    phase: "Onboarding",
    steps: BUILD_PROGRESS_STEPS.map((label, i) => ({
      label,
      done: i === 0,
    })),
    lastUpdate: new Date().toISOString(),
  };
}

function normalizeProgressSteps(
  progress: ProjectProgress,
  onboarding: OnboardingData,
): ProjectProgress {
  const labels = [...BUILD_PROGRESS_STEPS];
  const steps = progress.steps ?? [];
  const needsRebuild =
    steps.length !== labels.length || steps.some((s, i) => s.label !== labels[i]);

  if (!needsRebuild) return progress;

  const doneCount = onboarding.completed
    ? Math.max(2, Math.floor((progress.percent / 100) * labels.length))
    : onboarding.company.name
      ? 1
      : 0;

  return {
    ...progress,
    steps: labels.map((label, i) => ({ label, done: i < doneCount })),
  };
}

/** Migrate legacy onboarding data from older portal versions */
export function migrateOnboarding(data: Partial<OnboardingData> & Record<string, unknown>): OnboardingData {
  const base = createDefaultOnboarding();
  const step = (data.currentStep as string) ?? "company";
  const validSteps: OnboardingStepId[] = ["company", "wishes", "media", "integrations", "billing", "payment", "review"];
  const mappedStepRaw =
    step === "review" ? "payment" : step;
  const mappedStep = validSteps.includes(mappedStepRaw as OnboardingStepId)
    ? (mappedStepRaw as OnboardingStepId)
    : step === "profile" || step === "goals"
      ? "wishes"
      : step === "colors" || step === "references"
        ? "media"
        : "company";

  return {
    ...base,
    ...data,
    currentStep: mappedStep,
    completedSteps: (data.completedSteps as OnboardingStepId[])?.filter((s) =>
      validSteps.includes(s as OnboardingStepId),
    ) ?? [],
    goals: Array.isArray(data.goals) ? (data.goals as string[]) : [],
    desiredPages: (data.desiredPages as string[]) ?? [],
    integrations: Array.isArray(data.integrations) ? (data.integrations as string[]) : [],
    media: Array.isArray(data.media) ? (data.media as OnboardingData["media"]) : [],
    referenceWebsites: Array.isArray(data.referenceWebsites)
      ? (data.referenceWebsites as string[])
      : [],
    websiteReferences: normalizeWebsiteReferences({
      websiteReferences: data.websiteReferences as WebsiteReference[] | undefined,
      referenceWebsites: data.referenceWebsites as string[] | undefined,
    }),
    largeFilesStatus:
      (data.largeFilesStatus as OnboardingData["largeFilesStatus"]) ??
      (data.largeFilesSubmitted ? "sent" : undefined),
    automationDetails: (data.automationDetails as AutomationDetails) ?? {},
    company: { ...base.company, ...(data.company as CompanyProfile) },
    colors: { ...base.colors, ...(data.colors as BrandColors) },
    openingHours: (data.openingHours as OpeningHours) ?? createDefaultOpeningHours(),
  };
}

export function migrateIntegrationRequest(
  req: Partial<IntegrationRequest> & { integrationId: string; name: string; requestedAt: string },
): IntegrationRequest {
  return {
    id: req.id ?? generateId(),
    integrationId: req.integrationId,
    name: req.name,
    note: req.note,
    requestedAt: req.requestedAt,
    status: req.status ?? "new",
    internalNote: req.internalNote,
  };
}

export function generateClientNumberFromId(id: string): string {
  return `NX-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function migrateClient(client: ClientAccount & { phase?: ClientPhase }): ClientAccount {
  const clientNumber = client.clientNumber ?? generateClientNumberFromId(client.id);
  const onboarding = migrateOnboarding(client.onboarding as OnboardingData & Record<string, unknown>);
  const progress = normalizeProgressSteps(
    client.progress ?? createDefaultProgress(),
    onboarding,
  );
  return {
    ...client,
    clientNumber,
    phase: client.phase ?? "build",
    onboarding,
    integrationStatuses: client.integrationStatuses ?? {},
    integrationRequests: (client.integrationRequests ?? []).map((r) =>
      migrateIntegrationRequest(r as IntegrationRequest),
    ),
    billingInfo: client.billingInfo ?? {},
    assignedDocuments: client.assignedDocuments ?? [],
    previewSettings: client.previewSettings,
    clientDocuments: client.clientDocuments ?? [],
    progressSettings: client.progressSettings,
    packageLocked: client.packageLocked ?? false,
    websites: client.websites ?? [],
    technicalSetup: client.technicalSetup,
    payments: Array.isArray(client.payments) ? client.payments : [],
    tickets: Array.isArray(client.tickets) ? client.tickets : [],
    progress,
    package: client.package ?? {
      planId: "none",
      planName: "Nog te kiezen",
      monthlyPrice: "—",
      maintenanceIncluded: [],
      pendingSelection: true,
    },
  };
}
