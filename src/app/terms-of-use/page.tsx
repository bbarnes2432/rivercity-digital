import type { Metadata } from "next";
import LegalPage from "../_components/LegalPage";
import { TERMS_SECTIONS as SECTIONS } from "../_components/terms-of-use-content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for River City Digital Co.",
  alternates: { canonical: "/terms-of-use" },
};



export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      preface="We've kept this short and tried to write it like a person. If anything's unclear, just email us."
      lastUpdated="May 9, 2026"
      sections={SECTIONS}
      breadcrumbLabel="Terms of Use"
    />
  );
}
