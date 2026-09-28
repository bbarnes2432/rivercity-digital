import type { Metadata } from "next";
import LegalPage from "../_components/LegalPage";
import { PRIVACY_SECTIONS as SECTIONS } from "../_components/privacy-policy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How River City Digital Co. handles your information.",
  alternates: { canonical: "/privacy-policy" },
};



export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      preface="We've kept this short and tried to write it like a person. If anything's unclear, just email us."
      lastUpdated="September 18, 2026"
      sections={SECTIONS}
      breadcrumbLabel="Privacy Policy"
    />
  );
}
