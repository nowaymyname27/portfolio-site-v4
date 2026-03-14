export type CertificationStatus = "completed" | "in progress";

export type CertificationItem = {
  id: string;
  name: string;
  issuer: string;
  status: CertificationStatus;
  dateLabel: string;
  credentialUrl?: string;
  note?: string;
  hoverBorderClass?: string;
};

export const CERTIFICATIONS: CertificationItem[] = [
  {
    id: "aws-cloud-practitioner",
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    status: "completed",
    dateLabel: "earned 2025",
    credentialUrl:
      "https://cp.certmetrics.com/amazon/en/public/verify/credential/fe5b8d339ac840a1befd349b3648dca1",
    hoverBorderClass: "hover:border-emerald-500",
  },
  {
    id: "ccna",
    name: "CCNA Certification",
    issuer: "Cisco",
    status: "in progress",
    dateLabel: "in progress",
    note: "Focused on networking fundamentals and hands-on routing/switching practice.",
    hoverBorderClass: "hover:border-amber-500",
  },
];
